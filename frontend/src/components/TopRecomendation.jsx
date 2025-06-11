import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Search, MessageCircle, ThumbsUp, Clock, Plus, User, Eye } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

const TopRecomendation = () => {
  // const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    category: "",
    content: ""
  });

  const discussions = [
    {
      id: 1,
      title: "Best exercises for lower back pain relief?",
      author: "John Smith",
      category: "Orthopedics",
      replies: 12,
      likes: 23,
      views: 156,
      lastActivity: "2 hours ago",
      preview: "I've been experiencing lower back pain for the past few weeks and wondering what exercises might help...",
      isAnswered: true,
      hasDocterReply: true
    },
    {
      id: 2,
      title: "Healthy meal prep ideas for busy professionals",
      author: "Sarah Wilson",
      category: "Nutrition",
      replies: 8,
      likes: 34,
      views: 89,
      lastActivity: "4 hours ago",
      preview: "Looking for quick and healthy meal prep ideas that can be prepared on weekends...",
      isAnswered: false,
      hasDocterReply: false
    },
    {
      id: 3,
      title: "Managing anxiety during pregnancy - safe techniques?",
      author: "Maria Garcia",
      category: "Mental Health",
      replies: 15,
      likes: 41,
      views: 203,
      lastActivity: "6 hours ago",
      preview: "I'm 20 weeks pregnant and experiencing some anxiety. What are safe techniques for managing this?",
      isAnswered: true,
      hasDocterReply: true
    },
    {
      id: 4,
      title: "Skincare routine for sensitive skin",
      author: "Emily Chen",
      category: "Dermatology",
      replies: 6,
      likes: 18,
      views: 67,
      lastActivity: "1 day ago",
      preview: "I have very sensitive skin and am looking for gentle skincare routine recommendations...",
      isAnswered: false,
      hasDocterReply: false
    },
    {
      id: 5,
      title: "Normal blood pressure ranges by age?",
      author: "Robert Johnson",
      category: "Cardiology",
      replies: 9,
      likes: 28,
      views: 134,
      lastActivity: "1 day ago",
      preview: "Can someone explain what the normal blood pressure ranges are for different age groups?",
      isAnswered: true,
      hasDocterReply: true
    },
    {
      id: 6,
      title: "Sleep training tips for 6-month-old baby",
      author: "Lisa Park",
      category: "Pediatrics",
      replies: 11,
      likes: 22,
      views: 98,
      lastActivity: "2 days ago",
      preview: "My 6-month-old is still waking up multiple times at night. Any gentle sleep training suggestions?",
      isAnswered: false,
      hasDocterReply: false
    }
  ];

  const categories = ["All", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Mental Health", "Nutrition"];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitThread = (e) => {
    e.preventDefault();
    if (!newThread.title || !newThread.category || !newThread.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thread Created!",
      description: "Your discussion thread has been posted successfully.",
    });

    setNewThread({ title: "", category: "", content: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Health Discussions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our community to ask questions, share experiences, and get expert advice
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3"
              />
            </div>

            {/* New Thread Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start a New Discussion</DialogTitle>
                  <DialogDescription>
                    Ask a question or start a discussion about health topics. Our community and doctors will help provide answers.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitThread} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Discussion Title *
                    </label>
                    <Input
                      id="title"
                      value={newThread.title}
                      onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={newThread.category}
                      onChange={(e) => setNewThread({...newThread, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Question/Discussion *
                    </label>
                    <Textarea
                      id="content"
                      value={newThread.content}
                      onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                      placeholder="Describe your question or topic in detail..."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Post Discussion
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Discussions List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recent Discussions ({filteredDiscussions.length})
              </h2>
              <p className="text-gray-600">Join the conversation and get expert advice</p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link 
                          to={`/discussions/${discussion.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {discussion.title}
                        </Link>
                        {discussion.isAnswered && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Answered
                          </Badge>
                        )}
                        {discussion.hasDocterReply && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Doctor Reply
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{discussion.preview}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{discussion.author}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 text-right space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{discussion.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDiscussions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No discussions found matching your criteria</p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h2>
            <p className="text-lg text-gray-600">Help us maintain a supportive and respectful community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✅ Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be respectful and supportive</li>
                  <li>• Share accurate information</li>
                  <li>• Use appropriate categories</li>
                  <li>• Search before posting duplicates</li>
                  <li>• Thank helpful contributors</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">❌ Don't</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Share personal medical records</li>
                  <li>• Give specific medical diagnoses</li>
                  <li>• Use offensive language</li>
                  <li>• Spam or self-promote</li>
                  <li>• Ignore emergency situations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TopRecomendation;
