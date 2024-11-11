import {Container, Button} from "@radix-ui/themes"
import {ClipLoader} from "react-spinners";
import {useNetworkVariable} from "./constants.ts";
import {useSignAndExecuteTransaction, useSuiClient} from "@mysten/dapp-kit";
import { Transaction } from '@mysten/sui/transactions';

interface onCreatedtype{
    onCreated: (id: string)=>void
}
function CreateCounter({onCreated}:onCreatedtype){
    //get the package-id
    const packageId = useNetworkVariable("counterPackageId");
    const{mutate: signAndExecute, isSuccess, isPending} = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    //const [waitingTxn, setWaitingTxn] = useState(false);

    function create(){
        //first create a new transaction
        const tx = new Transaction();
        //call the createCounter function
        tx.moveCall({
            arguments: [],
            target: `${packageId}::counter::create`
        });
        //sign and execute
        signAndExecute(
            {transaction: tx},
            {onSuccess: async ({digest})=>{
                // get the effect from the result of the transaction
                const{effects} = await suiClient.waitForTransaction({digest, options:{showEffects: true}});
                //after the whole process is finished, call the callback function onCreated, pass the created counter's id as the string
                onCreated(effects?.created?.[0]?.reference?.objectId!)
            }}
        );
    }

    return(
        <Container>
            <Button size={3} onClick={()=>create()} disabled={isSuccess || isPending}>
                {isSuccess || isPending ? <ClipLoader size={20} /> : "Create Counter"}
            </Button>
        </Container>
    )
}

export default CreateCounter;