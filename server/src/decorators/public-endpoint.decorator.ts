import { SetMetadata } from '@nestjs/common';

export const PublicEndpoint = () => {
  return SetMetadata('isPublic', true);
};
