import React, { useState } from "react";
import { Users, Calendar, MapPin, MessageCircle, Filter } from "lucide-react";
import { mockMentorshipCircles, mockUsers } from "@/assets/staticData";

function MentorList() {
  const [activeTab, setActiveTab] = useState("mentors");
  const [selectedSkill, setSelectedSkill] = useState("all");

  const mentors = mockUsers.filter(
    (user) =>
      user.role === "mentor" ||
      user.role === "academic" ||
      user.role === "industry"
  );

  const allSkills = Array.from(
    new Set(mentors.flatMap((mentor) => mentor.skills))
  ).sort();
  const filteredMentors =
    selectedSkill === "all"
      ? mentors
      : mentors.filter((mentor) => mentor.skills.includes(selectedSkill));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Mentor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced professionals and academics who can guide
            your journey through personalized mentorship and collaborative
            learning circles.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab("mentors")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "mentors"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Individual Mentors
            </button>
            <button
              onClick={() => setActiveTab("circles")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "circles"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Mentorship Circles
            </button>
          </div>
        </div>

        {activeTab === "mentors" && (
          <>
            {/* Filter */}
            <div className="bg-white rounded-lg p-4 shadow-sm border mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Filter by skill:
                  </span>
                </div>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {mentor.role}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {mentor.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {mentor.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {mentor.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.skills.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{mentor.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mentorship Info */}
                    {mentor.mentorshipStyle && (
                      <div className="mb-4 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Style:</span>{" "}
                          {mentor.mentorshipStyle}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Available:</span>{" "}
                          {mentor.availability}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                        <MessageCircle size={16} />
                        <span>Connect</span>
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "circles" && (
          <div className="grid md:grid-cols-2 gap-8">
            {mockMentorshipCircles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={circle.image}
                  alt={circle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {circle.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{circle.description}</p>

                  {/* Focus Areas */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Focus Areas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {circle.focus.map((area) => (
                        <span
                          key={area}
                          className="bg-teal-50 text-teal-700 px-2 py-1 rounded-md text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{circle.meetingSchedule}</span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {circle.mentors.length} mentors, {circle.mentees.length}{" "}
                        mentees
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200">
                    Join Circle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorList;
