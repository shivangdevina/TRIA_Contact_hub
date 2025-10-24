import { Contact } from "@/components/ContactList";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// PRODUCTION: Helper function to get auth token
// const getAuthToken = (): string => {
//   const token = localStorage.getItem('authToken');
//   if (!token) throw new Error('No authentication token found');
//   return token;
// };

// Mock data store (simulating database)
let mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "+1 (555) 345-6789"
  },
  {
    id: "4",
    name: "David Thompson",
    email: "david.thompson@example.com",
    phone: "+1 (555) 456-7890"
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+1 (555) 567-8901"
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 678-9012"
  },
  {
    id: "7",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 (555) 789-0123"
  },
  {
    id: "8",
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    phone: "+1 (555) 890-1234"
  },
  {
    id: "9",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    phone: "+1 (555) 901-2345"
  },
  {
    id: "10",
    name: "Christopher Brown",
    email: "christopher.brown@example.com",
    phone: "+1 (555) 012-3456"
  }
];

// GET all contacts
export async function fetchContacts(): Promise<Contact[]> {
  await delay(800);
  
  // PRODUCTION API CALL:
  // const response = await fetch('https://api.yourdomain.com/api/v1/contacts', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch contacts');
  // const data = await response.json();
  // return data.contacts;
  
  return [...mockContacts];
}

// GET contacts by search query
export async function searchContacts(query: string): Promise<Contact[]> {
  await delay(400);
  
  // PRODUCTION API CALL:
  // const queryParams = new URLSearchParams({ q: query });
  // const response = await fetch(`https://api.yourdomain.com/api/v1/contacts/search?${queryParams}`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to search contacts');
  // const data = await response.json();
  // return data.contacts;
  
  if (!query.trim()) return [...mockContacts];
  
  const lowerQuery = query.toLowerCase();
  return mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(lowerQuery) ||
    contact.email?.toLowerCase().includes(lowerQuery) ||
    contact.phone?.includes(query)
  );
}

// POST create new contact
export async function createContact(contact: Omit<Contact, "id">): Promise<Contact> {
  await delay(600);
  
  // PRODUCTION API CALL:
  // const response = await fetch('https://api.yourdomain.com/api/v1/contacts', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(contact),
  // });
  // if (!response.ok) throw new Error('Failed to create contact');
  // const data = await response.json();
  // return data.contact;
  
  const newContact: Contact = {
    ...contact,
    id: crypto.randomUUID()
  };
  mockContacts = [...mockContacts, newContact];
  return newContact;
}

// PUT update contact
export async function updateContact(id: string, updates: Omit<Contact, "id">): Promise<Contact> {
  await delay(500);
  
  // PRODUCTION API CALL:
  // const response = await fetch(`https://api.yourdomain.com/api/v1/contacts/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(updates),
  // });
  // if (!response.ok) throw new Error('Failed to update contact');
  // const data = await response.json();
  // return data.contact;
  
  const index = mockContacts.findIndex(c => c.id === id);
  if (index === -1) throw new Error("Contact not found");
  
  const updatedContact: Contact = { ...mockContacts[index], ...updates };
  mockContacts = [
    ...mockContacts.slice(0, index),
    updatedContact,
    ...mockContacts.slice(index + 1)
  ];
  return updatedContact;
}

// DELETE contact
export async function deleteContact(id: string): Promise<void> {
  await delay(400);
  
  // PRODUCTION API CALL:
  // const response = await fetch(`https://api.yourdomain.com/api/v1/contacts/${id}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to delete contact');
  
  mockContacts = mockContacts.filter(c => c.id !== id);
}

// POST upload image
export async function uploadImage(file: File): Promise<string> {
  await delay(1000);
  
  // PRODUCTION API CALL:
  // const formData = new FormData();
  // formData.append('file', file);
  // formData.append('folder', 'contacts/avatars');
  // 
  // const response = await fetch('https://api.yourdomain.com/api/v1/upload', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${getAuthToken()}`,
  //     // Note: Don't set Content-Type header for FormData, browser will set it automatically
  //   },
  //   body: formData,
  // });
  // if (!response.ok) throw new Error('Failed to upload image');
  // const data = await response.json();
  // return data.url; // Returns the CDN URL of the uploaded image
  
  // MOCK: In a real API, this would upload to a server and return a URL
  // For now, we'll create a data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
