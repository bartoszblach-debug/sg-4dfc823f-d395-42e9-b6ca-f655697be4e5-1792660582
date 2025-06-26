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
      // Store in Firestore
      const contactsRef = collection(db, "contacts");
      
      const docRef = await addDoc(contactsRef, {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new"
      });
      
      // Send email notification using the API route
      try {
        await fetch('/api/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue even if email sending fails
      }
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  }
};

export default contactService;