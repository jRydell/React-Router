import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

type Contact = {
  id: string;
  first?: string;
  last?: string;
  createdAt: number;
};

export async function getContacts(query: string): Promise<Contact[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact(): Promise<Contact> {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact: Contact = { id, createdAt: Date.now() };
  let contacts = await getContacts("");
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string): Promise<Contact | null> {
  await fakeNetwork(`contact:${id}`);
  let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(
  id: string,
  updates: Partial<Contact>
): Promise<Contact> {
  await fakeNetwork();
  let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for " + id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string): Promise<boolean> {
  let contacts = (await localforage.getItem<Contact[]>("contacts")) ?? [];
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Contact[]): Promise<void> {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string): Promise<void> {
  return new Promise<void>((resolve) => {
    if (key !== undefined) {
      if (fakeCache[key]) {
        resolve();
        return;
      }
      fakeCache[key] = true;
    } else {
      fakeCache = {};
    }

    setTimeout(() => {
      resolve(); // Resolve the promise after the timeout
    }, Math.random() * 800);
  });
}
