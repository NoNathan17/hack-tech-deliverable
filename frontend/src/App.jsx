import React, { useEffect, useState } from "react";
import "./App.css";

function Quote({ name, message, time }) {
    return (
        <div className="quote">
            <p><strong>{name}</strong></p>
            <p>{message}</p>
            <p><em>{new Date(time).toLocaleString()}</em></p>
        </div>
    );
}

function App() {
	const [quotes, setQuotes] = useState([])
	const [maxAge, setMaxAge] = useState("all") // Keeps track of filter selection

	useEffect(() => {
		async function fetchQuotes() {
			const response = await fetch(`/api/quotes?max_age=${maxAge}`);
            const data = await response.json();
            setQuotes(data);
		}
		fetchQuotes();
	}, [maxAge]);

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Filter Quotes</h2>
			<select
				value={maxAge}
				onChange={(event) => setMaxAge(event.target.value)}
			>
				<option value="all">All</option>
				<option value="year">Last Year</option>
				<option value="month">Last Month</option>
				<option value="week">Last Week</option>
			</select>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
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
		</div>
	);
}

export default App;
