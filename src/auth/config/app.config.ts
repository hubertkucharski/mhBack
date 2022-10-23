import {config} from "../../../config/config";

export default () => ({
  jwtSecret: config.JWT_SECRET,
});
