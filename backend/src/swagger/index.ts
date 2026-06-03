import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('GoTech Hire Task API')
    .setDescription('The chat application API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  const swaggerDir = path.resolve(process.cwd(), 'swagger');
  if (!fs.existsSync(swaggerDir)) {
    fs.mkdirSync(swaggerDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(swaggerDir, 'swagger.json'),
    JSON.stringify(document, null, 2),
  );
}
