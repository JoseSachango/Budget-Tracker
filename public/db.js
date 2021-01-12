let db;

//open a connection to indexDB
const request = indexedDB.open("budgetTracker",1);



//handle the version number change
request.onupgradeneeded = function(event){
    db = event.target.result;
    const budgetTrackerOS = db.createObjectStore("budget",{ autoIncrement: true })
    budgetTrackerOS.createIndex("name","name");
    budgetTrackerOS.createIndex("value","value");
    budgetTrackerOS.createIndex("date","date");
}


//handle the successful creation of the database
request.onsuccess = function(event){
    db = event.target.result
    // check if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }



    /*
    const transaction = db.transaction(["budget"],"readwrite");
    const budgetStore = transaction.objectStore("budget");
    const nameIndex = budgetStore.index("name");
    const valueIndex = budgetStore.index("value");
    const dateIndex = budgetStore.index("date");

    //adding data to our budget store
    budgetStore.add({id:1,name:"snacks",value:10,date:1/11/2021});


    //getting data from our budget store using keypath
    const getRequestBudgetStore = budgetStore.get("1");
    getRequestBudgetStore.onsuccess = function(){
        console.log(getRequestBudgetStore.result)
    }

    //getting data from our budget store using index
    const getRequestBudgetStoreIndex = nameIndex.getAll("name")
    getRequestBudgetStoreIndex.onsuccess = function(){
        console.log(getRequestBudgetStoreIndex.result)
    } */

}

function saveRecord(record) {

    console.log("Value of record being passed into the saveRecord function: ",record)
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["budget"], "readwrite");
    console.log("Value we get from creating a transaction on the pending db with readwrite access: ",transaction)
  
    // access your pending object store
    const budgetStore = transaction.objectStore("budget");
    console.log("Value of accessing an object store called budget store: ",budgetStore);
  
    //console.log("Value of budgetStore.add(record): ",budgetStore.add(record))
    // add record to your store with add method.
    budgetStore.add(record);

    //console.log("Value of budgetStore.add(record): ",budgetStore.add(record))
  }


  function checkDatabase() {
    // open a transaction on your pending db
    
    const transaction = db.transaction(["budget"], "readwrite");
    // access your pending object store
    const budgetStore = transaction.objectStore("budget");
    // get all records from store and set to a variable
    const getAll = budgetStore.getAll();
    console.log("This is the value of db when objectstore is run: ",getAll)
  
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
          console.log("The length of the budget store is greater than 0. This is the length: ",getAll.result.length)
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
            console.log("We successfully posted to the /api/transaction/bulk route")
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["budget"], "readwrite");
  
          // access your pending object store
          const budgetStore = transaction.objectStore("budget");
  
          // clear all items in your store
          budgetStore.clear();
        }).catch(err=>{
            console.log("An error has occured trying to post to the /api/transaction/bulk route: ",err)
        });
      }
    };


  }



