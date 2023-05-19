import TaskView from "./components/TaskView";

// @ts-ignore
export default function App({ signOut, user }) {
    return (
        <>
            <h1>{user.username}'s Tasks</h1>
            <button onClick={signOut}>Sign Out</button>
            <TaskView />
        </>
    );
}
