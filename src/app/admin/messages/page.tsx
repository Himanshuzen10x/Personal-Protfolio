import { getMessages } from "@/lib/actions";
import AdminMessagesClient from "@/components/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const messagesData = await getMessages();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Messages</h1>
          <p className="admin-subtitle">Contact form submissions from visitors</p>
        </div>
      </div>
      <AdminMessagesClient messages={messagesData} />
    </div>
  );
}
