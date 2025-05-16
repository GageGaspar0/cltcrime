import './NumberOfRecords.css';

export default function NumberOfRecords({ data }) {
  const totalRecords = data.length;
  const totalCrimes = data.reduce((acc, crime) => acc + crime.count, 0);
  const totalCrimeTypes = new Set(data.map(crime => crime.type)).size;

  return (
    <div className="number-of-records">
      <h2>Total Records</h2>
      <p>{totalRecords} records</p>
      <h2>Total Crimes</h2>
      <p>{totalCrimes} crimes</p>
      <h2>Total Crime Types</h2>
      <p>{totalCrimeTypes} types</p>
    </div>
  );
}