async function run() {
    const res = await fetch('http://127.0.0.1:5000/api/public/tokens');
    const text = await res.text();
    console.log("Response:", text);
}
run();
