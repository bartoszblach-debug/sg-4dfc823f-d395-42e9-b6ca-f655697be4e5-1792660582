
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactService = {
  async submitContactForm(formData: ContactFormData) {
    try {
      const contactsRef = collection(db, "contacts");
      
      const docRef = await addDoc(contactsRef, {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new"
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  }
};

export default contactService;
