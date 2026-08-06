import type { IntegrationId } from '@/types/integration';

export class IntegrationNotConfiguredError extends Error {
  constructor(id: IntegrationId) {
    super(`A integração ${id} ainda não foi configurada em um backend seguro.`);
    this.name = 'IntegrationNotConfiguredError';
  }
}
