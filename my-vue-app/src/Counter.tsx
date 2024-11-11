import {useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery} from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import {Button, Flex, Heading, Text} from "@radix-ui/themes";
import {useState} from "react";
import {ClipLoader} from "react-spinners";
import {useNetworkVariable} from "./constants.ts";

function Counter({id}: {id:string}){
    const currentAccount = useCurrentAccount();
    const {data, isPending, error, refetch} = useSuiClientQuery(
        'getObject',
        {id, options: {showContent: true, showOwner: true}});
    const [waitTxn, setWaitTxn] = useState('');
    const packageId = useNetworkVariable('counterPackageId');
    const{mutate: signAndExecute} = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();

    if (isPending) return <div>Loading</div>
    if(error) return <div>error</div>
    if(!data.data) return <div>not found</div>

    function getCounterFields(data: SuiObjectData){
        if(data.content?.dataType !== 'moveObject'){
            return null
        }
        return data.content.fields as {value: number, owner: string}
    }
    const executeMoveCall = (method: 'increment' | 'setValue')=>{
        // set wait for txn
        setWaitTxn(method);
        const tx = new Transaction();
        //call the relevant function
        if(method === 'increment'){
            tx.moveCall({
                target: `${packageId}::counter::increment`,
                arguments: [tx.object(id)]
            })
        }else{
            tx.moveCall({
                target: `${packageId}::counter::setValue`,
                arguments: [tx.object(id), tx.pure.u64(0)]
            })
        }
        //sign and execute
        signAndExecute(
            {transaction: tx},
            {onSuccess: async ({digest})=>{
                await suiClient.waitForTransaction({digest}).then(async ()=>{
                    await refetch(); //update the data of counter
                    setWaitTxn(''); // update the state of waitTxn
                });
            }}
        );
    }
    const isOwnerByCurrentAccount = currentAccount?.address === getCounterFields(data.data)?.owner;

    return(
        <>
            <Heading size={3}>Counter: {id}</Heading>
            <Flex>
                <Text>Count: {getCounterFields(data.data)?.value}</Text>
                <Text>Owner: {getCounterFields(data.data)?.owner}</Text>
                <Flex>
                    <Button onClick={()=>executeMoveCall('increment')} disabled={waitTxn !== ''}>
                        {waitTxn === 'increment' ? <ClipLoader size={20} /> : 'increment'}
                    </Button>
                    {isOwnerByCurrentAccount ?
                        <Button
                        onClick={()=>executeMoveCall('setValue')} disabled={waitTxn !== ''}>
                        {waitTxn === 'setValue' ? <ClipLoader size={20} /> : 'setValue'}
                    </Button> :
                        null}
                </Flex>
            </Flex>
        </>
    )
}

export default Counter;