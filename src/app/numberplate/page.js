import Search from "@/components/Search/Search";
import styles from "./page.module.css";

export default function NumberPlate(){
    return(
       <div className={styles.numberplatePage}>
            <h1 className={styles.logo}>Search Number Plate</h1>
            <Search />
        </div>
    )
}