import { processor as mod_processor } from "./processors/mod.js";
import { processor as lbp_processor } from "./processors/lbp.js";
import { processor as weighted_pool_processor } from "./processors/weighted_pool.js";
import { processor as stable_pool_processor } from "./processors/stable_pool.js";

mod_processor();
// lbp_processor();
weighted_pool_processor();
stable_pool_processor();
