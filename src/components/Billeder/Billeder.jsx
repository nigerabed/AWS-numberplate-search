import styles from "./Billeder.module.css"
export default function Billeder({ carData }) {
  return (
    <div className={styles.BillederContainer}>
      <h2 className={styles.h2}>Billeder</h2>
      {carData && carData.image ? (
        <img
          src={carData.image}
          alt={`${carData.model} - ${carData.plate}`}
          className={styles.carImage}
        />
      ) : (
        <img
          src="https://static.wikia.nocookie.net/central/images/3/3f/Placeholder_view_vector.svg/revision/latest/scale-to-width-down/681?cb=20250302081817"
          alt="No car selected"
          className={styles.carImage}
        />
      )}
    </div>
  );
}
