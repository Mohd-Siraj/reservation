import "../App.css";
import React, { useState } from "react";

const TrainBooking = () => {
  const totalSeats = 80;
  const seatsPerRow = 7;
  const numberOfRows = 12;

  const [numberOfSeats, setNumberOfSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [currentBooking, setCurrentBooking] = useState([]);
  const numbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const getAvailableSeatsInRow = (rowNumber) => {
    const rowStart = rowNumber * seatsPerRow;
    const rowEnd = rowStart + seatsPerRow;
    return numbers
      .slice(rowStart, rowEnd)
      .filter((seat) => !bookedSeats.includes(seat));
  };

  const handleOnChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 7) {
      setNumberOfSeats(value);
    }
  };

  const bookSeats = () => {
    if (numberOfSeats === 0) {
      alert("Please enter the number of seats to book.");
      return;
    }

    const availableSeats = numbers.filter(
      (seat) => !bookedSeats.includes(seat)
    );
    if (numberOfSeats > availableSeats.length) {
      alert("Not enough seats available.");
      return;
    }

    let seatsToBook = [];

    for (let row = 0; row < numberOfRows; row++) {
      const availableInRow = getAvailableSeatsInRow(row);
      if (availableInRow.length >= numberOfSeats) {
        seatsToBook = availableInRow.slice(0, numberOfSeats);
        break;
      }
    }

    if (seatsToBook.length === 0) {
      for (
        let row = 0;
        row < numberOfRows && seatsToBook.length < numberOfSeats;
        row++
      ) {
        const availableInRow = getAvailableSeatsInRow(row);
        seatsToBook.push(
          ...availableInRow.slice(0, numberOfSeats - seatsToBook.length)
        );
      }
    }

    setBookedSeats((prev) => [...prev, ...seatsToBook]);
    setCurrentBooking(seatsToBook);
    setNumberOfSeats(0);
  };

  const resetBooking = () => {
    setBookedSeats([]);
    setCurrentBooking([]);
    setNumberOfSeats(0);
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <h2 className="train-booking-heading">Train Booking</h2>
        <div className="number-container">
          {numbers.map((number) => (
            <div
              key={number}
              className={`number-box ${
                bookedSeats.includes(number) ? "booked-seat" : ""
              }`}
              style={{
                backgroundColor: bookedSeats.includes(number)
                  ? "#f2c30e"
                  : "#6daf44",
              }}
            >
              {number}
            </div>
          ))}
        </div>
        <div className="seat-info">
          <p className="booked-seats">Booked Seats = {bookedSeats.length}</p>
          <p className="available-seats">
            Available Seats = {totalSeats - bookedSeats.length}
          </p>
        </div>
      </div>
      <div className="booking-container">
        <div className="booking-inner-container">
          <div className="booking-info">
            <p>Book seats</p>
            {currentBooking.map((seat) => (
              <p
                key={seat}
                className="number-box"
                style={{ backgroundColor: "green" }}
              >
                {seat}
              </p>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter number of seats"
              className="seat-input"
              onChange={handleOnChange}
            />
            <button onClick={bookSeats}>Book</button>
          </div>
          <button onClick={resetBooking}>Reset Booking</button>
        </div>
      </div>
    </div>
  );
};

export default TrainBooking;
