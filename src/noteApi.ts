import axios from "axios";

export const baseApi = axios.create({
    baseURL: `http://${window.location.hostname}:3001`,
    headers: { 
      "Content-Type": "application/json",
  
   },
    withCredentials: false
  });


// Create a note
export const createANote = async (noteTitle: string, noteBody: string, createdOn: string, lastModified: string) => {
    const response = baseApi.post("/notes-save", {
        noteTitle,
        noteBody,
        createdOn,
        lastModified
      });
    return response;  
}

// Read all notes
export const readAllNotes = async () => {
    const response = baseApi.get("/notes-get-all",{});
    return response;
}

// Read a note
export const readANote = async(id: number) => {
    const response = baseApi.get("/notes-get/:id", { params: { id: id} });
    return response;
}

// Update a note
export const updateANote = async(noteTitle: string = "", noteBody: string = "", id: number, typeOfUpdate: string, lastModified: string) => {
    const response = baseApi.put("/notes-update", {
        id,
        noteTitle,
        noteBody,
        typeOfUpdate,
        lastModified
    });
    return response;
}

// Delete a note
export const deleteFromDataBase = async (id: number) => {
    const response = await baseApi.delete("/notes-delete/:id", { params: { id: id} });
    return response;
}





