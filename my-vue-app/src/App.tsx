import {Box, Container, Flex, Heading} from "@radix-ui/themes";
import {ConnectButton, SuiClientProvider, useCurrentAccount, WalletProvider} from "@mysten/dapp-kit";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {networkConfig} from "./constants.ts";
import {useState} from "react";
import {isValidSuiObjectId} from "@mysten/sui/utils";
import CreateCounter from "./CreateCounter.tsx";
import Counter from "./Counter.tsx";

const queryClient = new QueryClient();

function InsideApp(){
//const currentAccount = useCurrentAccount();
const [counterId, setCounterId] = useState(()=>{
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null
});
const currentAccount = useCurrentAccount();

    return(
        <div>
            <Flex
                position="sticky"
                px="4"
                py="2"
                justify="between"
                style={{
                    borderBottom: "1px solid var(--gray-a2)",
                }}
            >
                <Box>
                    <Heading>dApp Starter Template</Heading>
                </Box>
                <Box>
                    <ConnectButton/>
                </Box>
            </Flex>
            <Container>
                <Container mt="5"
                           pt="2"
                           px="4"
                           style={{ background: "var(--gray-a2)", minHeight: 500 }}>
                    {currentAccount ? (counterId ? <Counter id={counterId}/> : <CreateCounter
                        onCreated={(id: string)=>{
                            window.location.hash = id;
                            setCounterId(id);
                            }} />) : <Heading>Please connect your wallet</Heading>}
                </Container>
            </Container>
            <p>current counterId:{counterId ? counterId : null}</p>
        </div>
    )
}

function App() {

  return (
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork='testnet'>
            <WalletProvider>
                <InsideApp />
            </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  )
}

export default App
