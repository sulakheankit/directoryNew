import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactWithData, Note } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NotesSectionProps {
  contact: ContactWithData;
}

export default function NotesSection({ contact }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      const response = await apiRequest("POST", `/api/contacts/${contact.id}/notes`, {
        content: noteContent,
        authorName: "Current User", // In a real app, this would come from auth context
        authorInitials: "CU"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contacts/${contact.id}`] });
      setNewNote("");
      setIsAddingNote(false);
      toast({
        title: "Note added successfully",
        description: "Your note has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      createNoteMutation.mutate(newNote.trim());
    }
  };

  const getNoteColor = (index: number) => {
    const colors = ['yellow', 'blue', 'green', 'purple'];
    return colors[index % colors.length];
  };

  const getNoteBgColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-50 border-l-yellow-400';
      case 'blue':
        return 'bg-blue-50 border-l-blue-400';
      case 'green':
        return 'bg-green-50 border-l-green-400';
      case 'purple':
        return 'bg-purple-50 border-l-purple-400';
      default:
        return 'bg-gray-50 border-l-gray-400';
    }
  };

  const getAvatarBgColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Manual Notes</h3>
        <Button 
          onClick={() => setIsAddingNote(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this contact..."
              rows={3}
              className="w-full mb-3"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddNote}
                disabled={!newNote.trim() || createNoteMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createNoteMutation.isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {contact.notes.map((note, index) => {
          const color = getNoteColor(index);
          return (
            <Card 
              key={note.id} 
              className={`${getNoteBgColor(color)} border-l-4 rounded-r-lg`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-8 h-8 ${getAvatarBgColor(color)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="font-medium text-sm">{note.authorInitials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{note.content}</p>
                      <p className="text-xs text-gray-500">
                        Added by {note.authorName} • {new Date(note.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
