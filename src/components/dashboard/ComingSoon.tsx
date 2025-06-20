import { AlertCircle, Bell, BellOff, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;

      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success("You'll be notified when this feature launches!", {
      position: 'top-right',
      style: {
          backgroundColor: '#d4edda',
          color: '#155724',
      }
      });
  };
  return (
     <div className="h-[100vh] flex items-center justify-center px-4 transition-colors duration-200">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div 
          className="relative inline-block mx-auto"
          aria-hidden="true"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-lg blur opacity-50 animate-pulse" />
          <div className="relative bg-card text-card-foreground px-4 py-2 rounded-lg shadow-sm">
            <AlertCircle className="h-12 w-12 text-primary mx-auto" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Coming Soon
        </h1>
        
        <p className="mt-2 text-lg text-muted-foreground">
          We're working on an exciting new feature to help you manage security waivers and policy exceptions.
          Get notified when it launches!
        </p>

        <div className="mt-8">
          {!isSubscribed ? (
            <form onSubmit={handleNotifyMe} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background text-foreground"
                required
                aria-label="Email for notification"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                variant="default"
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Me
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary">
              <BellOff className="h-5 w-5" />
              <span>You're on the notification list!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComingSoon