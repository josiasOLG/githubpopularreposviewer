Regras para Geração de Código Backend com Node.js + Express + MongoDB
🔧 Stack do Projeto
Linguagem: TypeScript

Framework: Express

Banco de Dados: MongoDB com Mongoose

Arquitetura: baseada em modularidade, camadas bem definidas, e boas práticas avançadas

Responsável por escrever o código: Copilot (modo avançado de engenharia)

🧠 Padrões de Engenharia Esperados
Escreva código como um engenheiro de software sênior/staff.

Nunca escreva código básico ou genérico. Sempre use padrões eficientes, performáticos e escaláveis.

Antes de sugerir qualquer trecho de código, analise profundamente o impacto no projeto como um todo.

A implementação deve estar preparada para crescer, ser testada, e seguir os princípios de arquitetura limpa.

⚙️ Regras Técnicas Obrigatórias
Linguagem obrigatória: TypeScript — nunca gerar arquivos .js, sempre .ts.

Banco de dados: usar MongoDB com Mongoose — sempre com schemas e modelos bem tipados.

Consultas complexas: sempre usar aggregate() com os stages otimizados ($match, $project, $lookup, $unwind, $facet, etc.).

Funções CRUD: otimizadas, com uso correto de índices e projeções (select, lean()).

Rotas e controladores: devem ser separados da lógica de domínio. Evitar lógica pesada nos handlers.

Validação de entrada: usar Zod ou Joi, nunca lógica de validação inline.

Erros: usar classes customizadas e middleware global de erro.

Código modular: cada domínio deve ter:

controller

service

model

repository

router

index.ts para exportação central

Nunca criar arquivos de teste (.test.ts, .spec.ts) automaticamente após finalizar qualquer alteração de código.

A criação de testes deve ser sempre uma decisão explícita e planejada pela equipe, e não uma tarefa automática do Copilot.

🧱 Convenções de Código
Todos os arquivos devem ser escritos em TypeScript com strict ativado no tsconfig.json.

Imports absolutos devem ser usados (ex: @/modules/users/service.ts), não caminhos relativos longos.

Todas as pastas devem conter um index.ts que exporte os arquivos relevantes.

Nunca usar any, preferir unknown + type guard se necessário.

Todas as variáveis e funções devem ter nomes claros, sem abreviações desnecessárias.

Não adicionar comentários no código — apenas JSDoc se for absolutamente necessário.

Todos os arquivos devem ser livres de console.log, comentários ou código morto.

A estrutura de pastas deve seguir padrões de arquitetura limpa, sem mistura de responsabilidades.

🚀 Estilo e Qualidade
Nunca escrever código duplicado.

Sempre reutilizar serviços, middlewares, schemas e funções de utilidade.

Usar Promise.all() ou parallel execution onde aplicável para performance.

Sempre que possível, preferir abordagens imutáveis e puras.

Priorizar segurança, performance e clareza.

Se possível, preparar o código para testes unitários com Jest — mas apenas quando explicitamente necessário.

Funções devem ser pequenas, concisas e com única responsabilidade.

Estrutura do projeto deve refletir nível avançado de engenharia back-end.

📑 Exemplo de Controller Sênior (Express + TS + Mongoose)
typescript
Copiar
Editar
import { Request, Response, NextFunction } from 'express';
import { userService } from '@/modules/users';
import { validateUserInput } from '@/modules/users/validation';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
try {
const data = validateUserInput(req.body);
const result = await userService.create(data);
res.status(201).json(result);
} catch (error) {
next(error);
}
};
🧪 Exemplo de Consulta Avançada com Aggregate
typescript
Copiar
Editar
export const getTopUsersByActivity = async () => {
return UserModel.aggregate([
{ $match: { isActive: true } },
{
$lookup: {
from: 'activities',
localField: '_id',
foreignField: 'userId',
as: 'activities',
},
},
{
$project: {
name: 1,
activityCount: { $size: '$activities' },
},
},
{ $sort: { activityCount: -1 } },
{ $limit: 10 },
]).exec();
};
❌ Nunca fazer
❌ Escrever código imperformático ou que cause full collection scan.

❌ Adicionar comentários explicativos no meio do código.

❌ Criar função com muitos efeitos colaterais.

❌ Usar .then() e .catch() ao invés de async/await.

❌ Misturar lógica de apresentação com lógica de negócio.

❌ Criar arquivos de teste (.test.ts, .spec.ts) automaticamente.

✅ Sempre fazer
✅ Usar lean() sempre que o documento não precisa de métodos do Mongoose.

✅ Separar validações com Zod ou Joi fora do controller.

✅ Injetar dependências ao invés de instanciar direto.

✅ Retornar erros com middleware padrão (HTTPException, etc.).

✅ Criar index.ts para centralizar imports em todas as pastas.
