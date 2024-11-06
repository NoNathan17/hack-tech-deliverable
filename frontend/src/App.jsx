import React, { useEffect, useState } from "react";
import "./index.css";

function Quote({ name, message, time }) { // Component for quotes
    return (
        <div className="quote bg-white p-4 rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-200">
            <p className="font-bold">{name}</p>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500"><em>{new Date(time).toLocaleString()}</em></p>
        </div>
    );
}

function Notification({ message, type }) {
    if (!message) return null;
    return (
        <div
            className={`notification ${type === "success" ? "bg-white" : "bg-white"} text-black px-4 py-2 rounded shadow-lg flex items-center`}
        >
            {message}
        </div>
    );
}

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [notification, setNotification] = useState({message: "", type: ""});

	useEffect(() => {
		async function fetchQuotes() {
			const response = await fetch(`/api/quotes?max_age=${maxAge}`);
			const data = await response.json();
			setQuotes(data);
		}
		fetchQuotes();
	}, [maxAge]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
		formData.append("message", message);
		
		fetch("/api/quote", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				setQuotes((prevQuotes) => [...prevQuotes, data]);
				setName("");
				setMessage(""); 

				setNotification({message: "Successfully submitted quote!", type: "success"});
				setTimeout(() => setNotification({message: "", type: ""}), 3000);
			})
	};

	return (
		<div className="min-h-screen bg-pink-50 p-8"> 
			<div className="logo flex justify-center mb-5">
				<img src="/img/quotebook.png" alt="Logo" className="w-24 h-24"/>
			</div>
			<h1 className="text-4xl font-bold text-center text-black-600 mb-8">Hack at UCI Tech Deliverable</h1>

			<div className="max-w-lg mx-auto">
				<h2 className="text-2xl font-semibold mb-4">Submit a quote</h2>
				<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
					<label htmlFor="input-name" className="block font-medium">Name</label>
					<input type="text" name="name" id="input-name" required value={name} onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"/>

					<label htmlFor="input-message" className="block font-medium">Quote</label>
					<input type="text" name="message" id="input-message" required value={message} onChange={(e) => setMessage(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"/>

					<button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">Submit</button>
				</form>

				<h2 className="text-2xl font-semibold mt-8 mb-4">Filter Quotes</h2>
				<select value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="w-full p-2 border rounded-md">
					<option value="all">All</option>
					<option value="year">Last Year</option>
					<option value="month">Last Month</option>
					<option value="week">Last Week</option>
				</select>

				<h2 className="text-2xl font-semibold mt-8 mb-4">Previous Quotes</h2>
				<div className="messages">
					{quotes.map((quote, index) => (
						<Quote
							key={index}
							name={quote.name}
							message={quote.message}
							time={quote.time}
						/>
					))}
				</div>

				<Notification message={notification.message} type={notification.type} />

			</div>
		</div>
	);
}

export default App;
