import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  SearchIcon,
  MapPin,
  Building2,
  Users,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Clock,
} from "lucide-react";
import companies from "@/data/companies";
import JobCard from "@/components/JobCard";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const stats = [
    { label: "Active Jobs", value: "10,000+", icon: Briefcase },
    { label: "Companies", value: "2,500+", icon: Building2 },
    { label: "Success Stories", value: "50,000+", icon: Star },
    { label: "New Jobs Daily", value: "500+", icon: TrendingUp },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const currentStat = stats[currentStatIndex];
  const StatIcon = currentStat.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="hero-text text-5xl md:text-6xl font-bold bg-clip-text mb-4 leading-tight text-[#333333]">
              Find Your Next Opportunity
            </h1>
            <p className="font-heading font-semibold text-xl md:text-2xl text-gray-600 ">
              Discover • Apply • Grow
            </p>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg border">
              <div className="p-2 bg-gradient-to-r from-[#b3ee6d] to-[#b3ee2d] rounded-full">
                <StatIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-800 animate-in">
                  {currentStat.value}
                </div>
                <div className="text-sm text-gray-600">{currentStat.label}</div>
              </div>
            </div>
          </div>

          {/* <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-4 py-3">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <Input
                      placeholder="Job title, skills, or company"
                      className="border-0 bg-transparent focus-visible:ring-0 text-lg"
                      // value={searchQuery}
                      // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-4 py-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <Input
                      placeholder="City or remote"
                      className="border-0 bg-transparent focus-visible:ring-0 text-lg"
                      // value={locationQuery}
                      // onChange={(e) => setLocationQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    // onClick={}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg rounded-lg shadow-lg transform transition hover:scale-105"
                  >
                    Search Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by
            </h2>
          </div>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full py-10"
          >
            <CarouselContent className="flex gap-5 sm:gap-20 items-center">
              {companies.map((company) => {
                return (
                  <CarouselItem
                    key={company.id}
                    className="basis-1/3 lg:basis-1/6"
                  >
                    <img
                      src={company.path}
                      alt={company.name}
                      className="h-9 sm:h-14 object-contain"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Featured Jobs Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-gray-600 text-lg">
              Hand-picked jobs from our top partners
            </p>
          </div>

          {/* <div className="grid md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{job.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {job.company}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All Jobs
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who found their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Browse All Jobs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Create Profile
            </Button>
          </div>
        </div>
      </div>
      <div className="h-16"></div> {/* Spacer */}
    </div>
  );
};

export default Home;
