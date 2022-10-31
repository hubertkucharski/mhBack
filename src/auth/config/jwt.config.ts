import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import {config} from "../../../config/config";

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    };
  },
};
