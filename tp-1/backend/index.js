const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
const port = 3500;

// Set the view engine to use EJS
// app.set('view engine', 'ejs');

// Define your collisionSchema here
const collisionSchema = new mongoose.Schema({

    _id: Number,
    NO_SEQ_COLL: String,
    JR_SEMN_ACCDN: String,
    DT_ACCDN: Date,
    CD_MUNCP: Number,
    NO_CIVIQ_ACCDN: String,
    SFX_NO_CIVIQ_ACCDN: String,
    BORNE_KM_ACCDN: String,
    RUE_ACCDN: String,
    TP_REPRR_ACCDN: Number,
    ACCDN_PRES_DE: String,
    NB_METRE_DIST_ACCD: Number,
    CD_GENRE_ACCDN: Number,
    CD_SIT_PRTCE_ACCDN: String,
    CD_ETAT_SURFC: Number,
    CD_ECLRM: Number,
    CD_ENVRN_ACCDN: Number,
    NO_ROUTE: String,
    CD_CATEG_ROUTE: Number,
    CD_ETAT_CHASS: String,
    CD_ASPCT_ROUTE: Number,
    CD_LOCLN_ACCDN: Number,
    CD_POSI_ACCDN: String,
    CD_CONFG_ROUTE: Number,
    CD_ZON_TRAVX_ROUTR: String,
    CD_PNT_CDRNL_ROUTE: String,
    CD_PNT_CDRNL_REPRR: String,
    CD_COND_METEO: Number,
    NB_VEH_IMPLIQUES_ACCDN: Number,
    NB_MORTS: Number,
    NB_BLESSES_GRAVES: Number,
    NB_BLESSES_LEGERS: Number,
    HEURE_ACCDN: String,
    AN: Number,
    NB_VICTIMES_TOTAL: Number,
    GRAVITE: String,
    REG_ADM: String,
    MRC: String,
    nb_automobile_camion_leger: Number,
    nb_camionLourd_tractRoutier: Number,
    nb_outil_equipement: Number,
    nb_tous_autobus_minibus: Number,
    nb_bicyclette: Number,
    nb_cyclomoteur: Number,
    nb_motocyclette: Number,
    nb_taxi: Number,
    nb_urgence: Number,
    nb_motoneige: Number,
    nb_VHR: Number,
    nb_autres_types: Number,
    nb_veh_non_precise: Number,
    NB_DECES_PIETON: Number,
    NB_BLESSES_PIETON: Number,
    NB_VICTIMES_PIETON: Number,
    NB_DECES_MOTO: Number,
    NB_BLESSES_MOTO: Number,
    NB_VICTIMES_MOTO: Number,
    NB_DECES_VELO: Number,
    NB_BLESSES_VELO: Number,
    NB_VICTIMES_VELO: Number,
    VITESSE_AUTOR: Number,
    LOC_X: Number,
    LOC_Y: Number,
    LOC_COTE_QD: String,
    LOC_COTE_PD: Number,
    LOC_DETACHEE: String,
    LOC_IMPRECISION: String,
    LOC_LONG: Number,
    LOC_LAT: Number,
  });

  // Define the schema for your MongoDB model
  const CollisionModel = mongoose.model("collision", collisionSchema);

async function fetchAndStoreData() {
    
  try {
    // Fetch data from the API
    const response = await axios.get(
      "https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f"
    );
    let data = response.data.result.records;

    

    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/collisionData");
    console.log("Connected to MongoDB");

    // Insert data into MongoDB
    await CollisionModel.insertMany(data);
    console.log("Data inserted successfully.");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    // Log the first two documents
   console.log("TEST--First Document:", data[0]);
   console.log("TEST--Second Document:", data[1]);

  } catch (error) {
    console.error("Error fetching and storing data:", error);
    throw error;
  }
}
// fetchAndStoreData();




function renderData(data) {
  app.get("/viewdata", (req, res) => {
    res.render("index", { data });
  });
}
// renderData();




//exemple extraction donnees
CollisionModel.find({}, { NB_BLESSES_VELO: 1, _id: 1 }).limit(5).then(collisions => {
    console.log(collisions);
    // Extracting information from a specific field of each document in the collection
    collisions.forEach(collision => {
        console.log("--Nb de blesses velos" + collisions.NB_BLESSES_VELO + "--Event_ID" + collisions._id); 
    });
});





// Define route for homepage
app.get("/", (req, res) => {
  res.send(
    "WELCOME MY DAIMYO, PLEASE TAKE A LOOK AT THE INTERNAL STATE OF AFFAIRS"
  );
});

//pour montrer les donnees???
app.get("/data", (req, res) => {
  res.json(data);
});

//const fs = require('fs');
// const csv = require('csv-parser');
//
// function csvToJson(csvFilePath, callback) {
//     const jsonArray = [];
//
//     fs.createReadStream(csvFilePath)
//         .pipe(csv())
//         .on('data', (row) => {
//             jsonArray.push(row);
//         })
//         .on('end', () => {
//             callback(null, jsonArray);
//         })
//         .on('error', (error) => {
//             callback(error, null);
//         });
// }
//
// // Example usage:
// const csvFilePath = 'example.csv';
// csvToJson(csvFilePath, (error, jsonArray) => {
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('JSON array:', jsonArray);
//     }
// });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
