import { AppServiceRepository } from '../../adapters/repositories/AppServiceRepository';
import { UserRepository } from '../../adapters/repositories/UserRepository';
import { User } from '../../entities/User';

export class GetAllUsers {
  constructor(
    private userRepository: UserRepository,
    private appServiceRepository?: AppServiceRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async executeWithDetails(): Promise<any[]> {
    try {
      // Usar o método otimizado com agregação
      const usersWithDetails = await this.userRepository.getAllWithDetails();

      if (!this.appServiceRepository) {
        return usersWithDetails.map(user => ({
          ...user,
          typeService: null,
        }));
      }

      // Buscar todos os AppServices únicos de uma vez
      const uniqueRoles = [...new Set(usersWithDetails.map(user => user.role).filter(Boolean))];
      const appServices = await Promise.all(
        uniqueRoles.map(async role => {
          try {
            const service = await this.appServiceRepository!.findById(role);
            return { role, service };
          } catch (error) {
            console.error(`Erro ao buscar AppService para role ${role}:`, error);
            return { role, service: null };
          }
        }),
      );

      // Criar mapa para acesso rápido aos AppServices
      const appServiceMap = new Map();
      appServices.forEach(({ role, service }) => {
        appServiceMap.set(role, service);
      });

      // Adicionar typeService aos usuários
      return usersWithDetails.map(user => {
        const appService = user.role ? appServiceMap.get(user.role) : null;
        const typeService = appService ? appService.name : null;

        return {
          ...user,
          typeService,
        };
      });
    } catch (error: any) {
      throw new Error(`Error getting all users with details: ${error.message}`);
    }
  }
}
