

const Appointments = ({ date, description, status, time }) => {
    return (
        <div>
            <h2>{date}</h2>
            <p>{time}</p>
            <p>{description}</p>
            <p>{status}</p>
        </div>
    );
};

export default Appointments;
