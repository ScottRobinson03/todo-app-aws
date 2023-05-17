import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import TaskView from "./components/TaskView";
import "./App.css";

Amplify.configure(awsExports);

export default function App() {
    return (
        <>
            <h1>Your Tasks</h1>
            <TaskView />
        </>
    );
}
