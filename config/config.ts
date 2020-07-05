import { parse } from "https://deno.land/std/encoding/yaml.ts";
import { readFileStrSync } from "https://deno.land/std/fs/mod.ts";

const data = readFileStrSync("./config/config.yaml", { encoding: "utf8" });

const _config: any = parse(data);

export { _config };
