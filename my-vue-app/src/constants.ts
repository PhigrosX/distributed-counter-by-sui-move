import {getFullnodeUrl} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";


const TESTNET_COUNTER_PACKAGE_ID = "0xe112e4e318e89550e62c5c91d86e6127be7a9fda830122dfc830b0518cbae802";

const {networkConfig, useNetworkVariable,} = createNetworkConfig(
    {testnet:{url: getFullnodeUrl('testnet'), variables:{counterPackageId: TESTNET_COUNTER_PACKAGE_ID}}});

export {networkConfig, useNetworkVariable};
