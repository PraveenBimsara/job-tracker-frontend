import { Link } from 'react-router-dom';
import { Briefcase, Target, BarChart3, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: Target,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'See your progress with beautiful charts and insights',
    },
    {
      icon: CheckCircle,
      title: 'Kanban Board',
      description: 'Drag and drop jobs through your application pipeline',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">JobTrackr</span>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Job Applications
            <span className="block text-primary-600 mt-2">Like a Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop losing track of your applications. Organize, manage, and analyze your job search all in one beautiful dashboard.
          </p>
          <Link to="/register">
            <Button variant="primary" size="large" className="text-lg px-8 py-4">
              Start Tracking for Free
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to organize your job search?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of job seekers who are landing their dream jobs faster
          </p>
          <Link to="/register">
            <Button variant="secondary" size="large" className="text-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 JobTrackr. Built with ❤️ for job seekers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;