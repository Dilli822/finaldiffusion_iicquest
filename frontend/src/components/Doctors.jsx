
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Star, MapPin, Clock } from "lucide-react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 4.9,
      experience: "15 years",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      bio: "Specialist in cardiovascular diseases and preventive cardiology.",
      availability: "Available Now",
      languages: ["English", "Spanish"],
      education: "Harvard Medical School"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      rating: 4.8,
      experience: "12 years",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      bio: "Expert in skin conditions and cosmetic dermatology.",
      availability: "Available in 30 mins",
      languages: ["English", "Mandarin"],
      education: "Stanford Medical School"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: 4.9,
      experience: "10 years",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1594824375198-2aac9d1de4a9?w=400&h=400&fit=crop&crop=face",
      bio: "Dedicated to providing comprehensive care for children.",
      availability: "Available Now",
      languages: ["English", "Spanish"],
      education: "Johns Hopkins Medical School"
    },
    {
      id: 4,
      name: "Dr. David Wilson",
      specialty: "Orthopedics",
      rating: 4.7,
      experience: "18 years",
      location: "Houston, TX",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
      bio: "Specialized in sports medicine and joint replacement.",
      availability: "Available in 1 hour",
      languages: ["English"],
      education: "Mayo Clinic Medical School"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Psychiatry",
      rating: 4.8,
      experience: "14 years",
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
      bio: "Specializing in anxiety, depression, and mood disorders.",
      availability: "Available Now",
      languages: ["English", "French"],
      education: "UCSF Medical School"
    },
    {
      id: 6,
      name: "Dr. James Anderson",
      specialty: "Neurology",
      rating: 4.9,
      experience: "20 years",
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      bio: "Expert in neurological disorders and brain health.",
      availability: "Available in 45 mins",
      languages: ["English"],
      education: "Harvard Medical School"
    }
  ];

  const specialties = ["All", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Psychiatry", "Neurology"];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });


   const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
 
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Doctor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with certified healthcare professionals for consultations and treatment
          </p>


          {/* test search bar */}

          <div>
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit}/>
          </div>

          {/* Search Bar */}
          {/* <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
                className={selectedSpecialty === specialty ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Doctors ({filteredDoctors.length})
            </h2>
            <p className="text-gray-600">Choose from our qualified healthcare professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                      doctor.availability === "Available Now" ? "bg-green-500" : "bg-yellow-500"
                    }`}></div>
                  </div>
                  <CardTitle className="text-xl">{doctor.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{doctor.specialty}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doctor.experience}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={doctor.availability === "Available Now" ? "text-green-600 font-medium" : "text-yellow-600"}>
                        {doctor.availability}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-4 space-y-2">
                    <Link to={`/chat/${doctor.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </Link>
                    <Link to="/appointments" className="block">
                      <Button variant="outline" className="w-full">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No doctors found matching your criteria</p>
              <Button onClick={() => { setSearchTerm(""); setSelectedSpecialty("All"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
