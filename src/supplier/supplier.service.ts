import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { Supplier, Roles } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { CreateSupplierDto, updateRole, addRolesToSupplier } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateSupplierDto) {
    const existed = await this.supplierRepository.findOne({
      where: { email: dto.email },
    });

    if (existed) {
      throw new ConflictException(`${existed.email} already exists and the status is ${existed.status}`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const lastUser = await this.supplierRepository
      .createQueryBuilder('supplier')
      .select('MAX(CAST(SUBSTRING(supplier.supplierId, 7) AS UNSIGNED))', 'max')
      .getRawOne();
    
    const maxId = lastUser?.max || 999;
    const newSupplierId = 'EPQSUP' + (maxId + 1);
    
    const supplier = this.supplierRepository.create({
      supplierId: newSupplierId,
      status: 'Inprogress',
      tradingName: dto.tradingName,
      legalName: dto.legalName,
      address: dto.address,
      phone: dto.phone,
      email: dto.email,
      businessRegisterNumber: dto.businessRegisterNumber,
      registeredCountry: dto.registeredCountry,
      password: hashedPassword,
    });

    try {
      await this.sendSupplierAccountCreationEmail(supplier.email, supplier.tradingName);
      await this.supplierRepository.save(supplier);
      await this.notificationService.create('Supplier', 'Action required For the ', supplier.email);
      
      return {
        message: 'The request has been forwarded to the admin for further inquiry. Please wait for approval.',
      };
    } catch (error) {
      console.error('❌ Error saving supplier to database:', error);
      throw new InternalServerErrorException('Error registering the account.');
    }
  }

  async updateRole(dto: updateRole) {
    const supplier = await this.supplierRepository.findOne({
      where: { email: dto.email },
    });

    if (supplier.actionBy) {
      throw new ConflictException('Action already taken ');
    }

    const supplierTerms = `This operator has self-certified that they are committed to only offer services that comply with applicable laws, including EU law.\n\nThis supplier is a trader on the EpicQuest marketplace. EpicQuest is an online intermediation platform that allows consumers to buy experiences from third-party providers. For your protection, make sure you use EpicQuest's platform to communicate with operators and pay for bookings.`;
    
    supplier.status = dto.status;
    supplier.text = supplierTerms;
    supplier.actionBy = `admin ${new Date().toISOString()}`;
    
    const role = await this.supplierRepository.update(supplier.id, {
      status: supplier.status,
      text: supplier.text,
      actionBy: supplier.actionBy,
    });
    
    await this.notificationService.create('Supplier', `${supplier.supplierId} has been approved`, 'Admin');
    await this.sendSupplierAccountActionEmail(supplier.email, supplier.tradingName, supplier.status);
    
    return {
      message: 'Email Sent successfully and data saved to database',
    };
  }

  async findAll(page: number, limit: number, roles: string[], email?: string) {
    const skip = (page - 1) * limit;
    
    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .orderBy('supplier.id', 'DESC')
      .leftJoinAndSelect('supplier.roles', 'role');
    
    if (email) {
      query.andWhere('supplier.email = :email', { email });
    }
    
    if (roles && roles.length > 0) {
      query
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('supplierSub.id')
            .from('supplier', 'supplierSub')
            .leftJoin('supplierSub.roles', 'roleSub')
            .where('roleSub.roleName IN (:...roles)')
            .getQuery();
          return 'supplier.id IN ' + subQuery;
        })
        .setParameter('roles', roles);
    }
    
    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();
    
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(email: string) {
    const supplier = await this.supplierRepository.findOne({
      where: { email: email },
    });
    
    if (!supplier) {
      throw new NotFoundException(`No supplier found with email ${email}`);
    }
    
    return {
      tradingName: supplier.tradingName,
      legalName: supplier.legalName,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email,
      businessRegisterNumber: supplier.businessRegisterNumber,
      registeredCountry: supplier.registeredCountry,
    };
  }

  async update(dto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.findOne({
      where: { email: dto.email },
    });
    
    if (!supplier) {
      throw new NotFoundException(`No supplier found with email ${dto.email}`);
    }
    
    if (dto.tradingName) {
      supplier.tradingName = dto.tradingName;
    }
    
    if (dto.legalName) {
      supplier.legalName = dto.legalName;
    }
    
    if (dto.address) {
      supplier.address = dto.address;
    }
    
    if (dto.phone) {
      supplier.phone = dto.phone;
    }
    
    if (dto.email) {
      supplier.email = dto.email;
    }
    
    if (dto.businessRegisterNumber) {
      supplier.businessRegisterNumber = dto.businessRegisterNumber;
    }
    
    if (dto.registeredCountry) {
      supplier.registeredCountry = dto.registeredCountry;
    }
    
    if (dto.password) {
      supplier.password = await bcrypt.hash(dto.password, 10);
    }
    
    await this.supplierRepository.save(supplier);
    
    return {
      tradingName: supplier.tradingName,
      legalName: supplier.legalName,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email,
      businessRegisterNumber: supplier.businessRegisterNumber,
      registeredCountry: supplier.registeredCountry,
    };
  }

  async remove(email: string) {
    const supplier = await this.supplierRepository.findOne({
      where: { email },
    });
    
    if (!supplier) {
      throw new NotFoundException(`No supplier found with email ${email}`);
    }
    
    await this.supplierRepository.remove(supplier);
    return `Supplier with email ${email} has been successfully removed`;
  }

  async sendSupplierAccountCreationEmail(email: string, name: string) {
    const transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.NOREPLAY_EMAILUSERNAME}`,
        pass: `${process.env.NOREPLAY_EMAILPASSWORD}`,
      },
    });

    const mailOptions = {
      from: `"noreply EpicQuest" <${process.env.NOREPLAY_EMAILUSERNAME}>`,
      to: email,
      subject: 'Supplier Account Creation Requested',
      html: `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        padding: 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #2d3e50;
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .highlight {
        font-weight: bold;
        color: #007bff;
      }
      .footer {
        font-size: 14px;
        color: #FF0000;
        text-align: center;
        margin-top: 20px;
      }
      .button {
        background-color: #007bff;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 4px;
        
        display: inline-block;
        font-weight: bold;
      }
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Welcome to EpicQuest!</h2>
      <p>Dear <span class="highlight">${name}</span>,</p>
      <p>Your supplier account has been successfully created. Please wait for the admin to review and accept your request.</p>
      <p>Once your account is approved, you will be notified with further instructions. We will make sure the process is quick and easy!</p>
      <p>Thank you for your patience.</p>
      <p>If you have any questions, feel free to contact us.</p>
      <p><a href="mailto:support@epicquest.com.ph" style="color: #007bff; text-decoration: none;">support@epicquest.com.ph</a></p>
      <p>Best regards,</p>
      <p><strong>EpicQuest</strong></p>
      <p class="footer">If you did not request this account, please ignore this email or contact us for support.</p>
    </div>
  </body>
</html>`,
      headers: {
        'X-Priority': '1',
        Importance: 'high',
      },
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendSupplierAccountActionEmail(email: string, name: string, status: string) {
    const transporter = nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.NOREPLAY_EMAILUSERNAME}`,
        pass: `${process.env.NOREPLAY_EMAILPASSWORD}`,
      },
    });

    const mailOptions = {
      from: `"noreplay EpicQuest" <${process.env.NOREPLAY_EMAILUSERNAME}>`,
      to: email,
      subject: 'Supplier Account Status',
      html: `
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
                margin: 0;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            h1 {
                color: #007bff;
                text-align: center;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 10px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                text-align: center;
            }
            .footer a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Account Status Update</h1>
            <p>Dear ${name},</p>
            <p>Your supplier account status has been updated by the admin. The current status is: <strong>${status}</strong>.</p>
            <p>If you have any questions or concerns, please feel free to contact us.</p>
            <p><a href="mailto:support@epicquest.com.ph">support@epicquest.com.ph</a></p>
        </div>
        <div class="footer">
            <p>Thank you for being a part of EpicQuest!</p>
            <p>If you need assistance, reach out to our support team at <a href="mailto:support@epicquest.com.ph">support@epicquest.com.ph</a>.</p>
        </div>
    </body>
</html>
`,
      headers: {
        'X-Priority': '1',
        Importance: 'high',
      },
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async assignRoleTOSupplier(data: addRolesToSupplier) {
    const { role, supplierEmail } = data;
    
    const supplier = await this.supplierRepository.findOne({
      where: { email: supplierEmail },
      relations: ['roles'],
    });
    
    if (!supplier) {
      throw new NotFoundException(`No supplier found with email ${supplierEmail}`);
    }
    
    const existingRole = supplier.roles.find((r) => r.roleName === role);
    if (existingRole) {
      throw new BadRequestException(`Role '${role}' is already assigned to this supplier.`);
    }
    
    const newRole = this.rolesRepository.create({
      roleName: role,
      supplier,
    });
    
    await this.notificationService.create('Supplier', `${supplier.email} new role added to the supplier`, 'admin');
    await this.rolesRepository.save(newRole);
    
    return { message: 'Role assigned successfully', role: newRole };
  }
}