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
        const response = await fetch('/api/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            id: docRef.id
          }),
        });
        
        const result = await response.json();
        console.log('Email notification result:', result);
        
        if (!result.emailSent && result.success) {
          console.warn('Contact form saved but email notification not sent. Check SendGrid configuration.');
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue execution - we don't want to fail the whole submission if just the email fails
      }
      
      // Return success after storing in Firestore
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  }
};

export default contactService;