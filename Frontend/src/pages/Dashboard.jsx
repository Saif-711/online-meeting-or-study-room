
export default function Dashboard() {
    console.log(localStorage.getItem("token"));
    return (
        <h1>Welcome to the Dashboard</h1>
    );
}