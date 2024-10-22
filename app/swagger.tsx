'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import openApiDocument from './api/openapi';

export default function SwaggerPage() {
    return <SwaggerUI spec={openApiDocument} />;
}
