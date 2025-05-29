import { AppServiceRepository } from '../../adapters/repositories/AppServiceRepository';
import { UserRepository } from '../../adapters/repositories/UserRepository';

export class GetUserByIdAdmin {
  constructor(
    private userRepository: UserRepository,
    private appServiceRepository?: AppServiceRepository,
  ) {}

  async execute(userId: string): Promise<any | null> {
    try {
      const userWithDetails = await this.userRepository.getByIdWithDetails(userId);

      if (!userWithDetails) {
        return null;
      }

      if (!this.appServiceRepository) {
        return {
          ...userWithDetails,
          typeService: null,
        };
      }

      // Buscar o AppService baseado no role do usuário
      let typeService = null;
      if (userWithDetails.role) {
        try {
          const appService = await this.appServiceRepository.findById(userWithDetails.role);
          typeService = appService ? appService.name : null;
        } catch (error) {
          console.error(`Erro ao buscar AppService para role ${userWithDetails.role}:`, error);
        }
      }

      return {
        ...userWithDetails,
        typeService,
      };
    } catch (error: any) {
      throw new Error(`Error getting user by ID with details: ${error.message}`);
    }
  }
}
