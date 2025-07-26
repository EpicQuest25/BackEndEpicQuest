import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourPackage } from './entities/tourPackage.model';
import { Introduction } from './entities/Introduction.model';
import { TourPlan } from './entities/tourPlan.Model';
import { VisitPlaceImage } from './entities/visitPlaceImage.model';
import { MainImage } from './entities/mainImage.model';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
    private tourPackageRepository: Repository<TourPackage>,
    @InjectRepository(Introduction)
    private introductionRepository: Repository<Introduction>,
    @InjectRepository(TourPlan)
    private tourPlanRepository: Repository<TourPlan>,
    @InjectRepository(VisitPlaceImage)
    private visitPlaceImageRepository: Repository<VisitPlaceImage>,
    @InjectRepository(MainImage)
    private mainImageRepository: Repository<MainImage>,
  ) {}

  async create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
    // Check if package with the same ID already exists
    const existingPackage = await this.tourPackageRepository.findOne({
      where: { packageId: createTourPackageDto.packageId },
    });

    if (existingPackage) {
      throw new ConflictException(`Tour package with ID ${createTourPackageDto.packageId} already exists`);
    }

    // Create new tour package
    const tourPackage = new TourPackage();
    tourPackage.packageId = createTourPackageDto.packageId || `TOUR-${uuidv4().substring(0, 8)}`;
    tourPackage.status = createTourPackageDto.status;
    tourPackage.packageType = createTourPackageDto.packageType;
    tourPackage.overView = createTourPackageDto.overView;
    tourPackage.objective = createTourPackageDto.objective;
    tourPackage.metaInfo = createTourPackageDto.metaInfo;
    tourPackage.accommodation = createTourPackageDto.accommodation;

    // Save the tour package first to get the ID
    const savedTourPackage = await this.tourPackageRepository.save(tourPackage);

    // Create introduction if provided
    if (createTourPackageDto.introduction) {
      const introduction = new Introduction();
      introduction.tourPackage = savedTourPackage;
      
      // Map introduction data from DTO to entity
      const introData = createTourPackageDto.introduction as any;
      introduction.mainTitle = introData.mainTitle || 'Main Title';
      introduction.subTitle = introData.subTitle || 'Sub Title';
      introduction.tripType = introData.tripType || 'Standard';
      introduction.journeyDuration = introData.journeyDuration || '7 days';
      introduction.journeyStartDate = introData.journeyStartDate || new Date().toISOString();
      introduction.journeyEndDate = introData.journeyEndDate || new Date().toISOString();
      introduction.journeyLocationCity = introData.journeyLocationCity || 'City';
      introduction.journeyLocationCountry = introData.journeyLocationCountry || 'Country';
      introduction.totalSeat = introData.totalSeat || '20';
      introduction.minimumAge = introData.minimumAge || '18';
      introduction.maximumAge = introData.maximumAge || '65';
      introduction.minimumPerson = introData.minimumPerson || 1;
      introduction.packagePrice = introData.packagePrice || '1000';
      introduction.withAirFare = introData.withAirFare || false;
      introduction.withHotel = introData.withHotel || true;
      introduction.packageDiscountType = introData.packageDiscountType || 'percentage';
      introduction.packageDiscountAmount = introData.packageDiscountAmount || '0';
      await this.introductionRepository.save(introduction);
    }

    // Create tour plans if provided
    // Create tour plans if provided
    if (createTourPackageDto.tourPlans && Array.isArray(createTourPackageDto.tourPlans)) {
      for (let index = 0; index < createTourPackageDto.tourPlans.length; index++) {
        const planData = createTourPackageDto.tourPlans[index];
        const tourPlan = new TourPlan();
        tourPlan.tourPackage = savedTourPackage;
        tourPlan.title = (planData as any).title || `Day ${index + 1}`;
        tourPlan.plan = planData;
        await this.tourPlanRepository.save(tourPlan);
      }
    }

    // Create visit place images if provided
    // Create visit place images if provided
    if (createTourPackageDto.visitPlaceImages && Array.isArray(createTourPackageDto.visitPlaceImages)) {
      for (let index = 0; index < createTourPackageDto.visitPlaceImages.length; index++) {
        const imageData = createTourPackageDto.visitPlaceImages[index];
        const visitPlaceImage = new VisitPlaceImage();
        visitPlaceImage.tourPackage = savedTourPackage;
        visitPlaceImage.index = index;
        visitPlaceImage.imageUrl = (imageData as any).url || '';
        await this.visitPlaceImageRepository.save(visitPlaceImage);
      }
    }

    // Create main images if provided
    // Create main images if provided
    if (createTourPackageDto.mainImages && Array.isArray(createTourPackageDto.mainImages)) {
      for (let index = 0; index < createTourPackageDto.mainImages.length; index++) {
        const imageData = createTourPackageDto.mainImages[index];
        const mainImage = new MainImage();
        mainImage.tourPackage = savedTourPackage;
        mainImage.index = index;
        mainImage.imageUrl = (imageData as any).url || '';
        await this.mainImageRepository.save(mainImage);
      }
    }

    // Return the complete tour package with all relations
    return this.findOne(savedTourPackage.id);
  }

  async findAll(): Promise<TourPackage[]> {
    return this.tourPackageRepository.find({
      relations: ['introduction', 'tourPlans', 'visitPlaceImage', 'mainImage'],
    });
  }

  async findOne(id: number): Promise<TourPackage> {
    const tourPackage = await this.tourPackageRepository.findOne({
      where: { id },
      relations: ['introduction', 'tourPlans', 'visitPlaceImage', 'mainImage'],
    });

    if (!tourPackage) {
      throw new NotFoundException(`Tour package with ID ${id} not found`);
    }

    return tourPackage;
  }

  async findByPackageId(packageId: string): Promise<TourPackage> {
    const tourPackage = await this.tourPackageRepository.findOne({
      where: { packageId },
      relations: ['introduction', 'tourPlans', 'visitPlaceImage', 'mainImage'],
    });

    if (!tourPackage) {
      throw new NotFoundException(`Tour package with ID ${packageId} not found`);
    }

    return tourPackage;
  }

  async update(id: number, updateTourPackageDto: UpdateTourPackageDto): Promise<TourPackage> {
    const tourPackage = await this.findOne(id);

    // Update basic fields if provided
    if (updateTourPackageDto.status) tourPackage.status = updateTourPackageDto.status;
    if (updateTourPackageDto.packageType) tourPackage.packageType = updateTourPackageDto.packageType;
    if (updateTourPackageDto.overView) tourPackage.overView = updateTourPackageDto.overView;
    if (updateTourPackageDto.objective) tourPackage.objective = updateTourPackageDto.objective;
    if (updateTourPackageDto.metaInfo) tourPackage.metaInfo = updateTourPackageDto.metaInfo;
    if (updateTourPackageDto.accommodation) tourPackage.accommodation = updateTourPackageDto.accommodation;

    await this.tourPackageRepository.save(tourPackage);

    // Return the updated tour package
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tourPackage = await this.findOne(id);
    await this.tourPackageRepository.remove(tourPackage);
  }

  async findByType(packageType: string): Promise<TourPackage[]> {
    return this.tourPackageRepository.find({
      where: { packageType },
      relations: ['introduction', 'tourPlans', 'visitPlaceImage', 'mainImage'],
    });
  }

  async findByStatus(status: string): Promise<TourPackage[]> {
    return this.tourPackageRepository.find({
      where: { status },
      relations: ['introduction', 'tourPlans', 'visitPlaceImage', 'mainImage'],
    });
  }
}