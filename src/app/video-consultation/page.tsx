
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Video, Mic, MicOff, PhoneOff, Loader2, Stethoscope, HeartPulse, Activity, Wind, Thermometer, NotebookPen, FilePlus, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Appointment } from '@/lib/types';

interface Vitals {
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  temperature: number;
}

// Add this type definition for SpeechRecognition
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}

const mockPatient = {
    id: "PAT-VID-007",
    name: "Ravi Kumar",
    department: "General Physician"
}

export default function VideoConsultationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [quickNote, setQuickNote] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 70,
    bloodPressure: '120/80',
    oxygenSaturation: 98,
    temperature: 98.6,
  });

  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("appointments", []);

  useEffect(() => {
    let isMounted = true;

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) {
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Unsupported Browser',
                description: 'Your browser does not support video consultations.',
            });
            setIsConnecting(false);
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (isMounted) {
            streamRef.current = stream;
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } else {
            stream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        if (!isMounted) return;

        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setIsConnecting(false);

        let title = 'Camera Access Denied';
        let description = 'Please enable camera and microphone permissions in your browser settings to use video consultation.';

        if (error instanceof DOMException) {
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                title = 'No Device Found';
                description = 'Could not find a camera or microphone. Please ensure they are connected and available.';
            } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                 title = 'Permission Denied';
                 description = 'Camera and microphone access was denied. Please grant permission to continue.';
            }
        }
        
        toast({
          variant: 'destructive',
          title: title,
          description: description,
        });
      }
    };

    getCameraPermission();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    let connectionTimeout: NodeJS.Timeout;

    if (hasCameraPermission) {
        connectionTimeout = setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
            toast({
                title: "Connected!",
                description: "You are now connected with Dr. Ankit.",
            });
        }, 3000);
    } else if(hasCameraPermission === false) {
        setIsConnecting(false);
        setIsConnected(false);
    }

    return () => {
      clearTimeout(connectionTimeout);
    };
  }, [hasCameraPermission, toast]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setVitals({
        heartRate: Math.floor(Math.random() * (90 - 65 + 1) + 65), // Random HR between 65 and 90
        bloodPressure: `${''}${Math.floor(Math.random() * (125 - 115 + 1) + 115)}/${''}${Math.floor(Math.random() * (85 - 75 + 1) + 75)}`,
        oxygenSaturation: Math.floor(Math.random() * (100 - 95 + 1) + 95), // Random O2 between 95 and 100
        temperature: parseFloat((Math.random() * (99.0 - 98.0) + 98.0).toFixed(1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    toast({
      title: "Call Ended",
      description: "Your consultation has ended.",
    });

    router.back();
  };

  const handleToggleMute = () => {
    if (streamRef.current) {
        const audioTracks = streamRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
            setIsMuted(!audioTracks[0].enabled);
        }
    }
  };

  const handleSaveNote = () => {
    if (!quickNote.trim()) return;
    console.log("Saving note for patient:", quickNote);
    toast({
        title: "Note Saved!",
        description: "The note has been added to the patient's temporary record.",
    });
  };

  const handleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setPrescriptionText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
       toast({
        variant: "destructive",
        title: "Recognition Error",
        description: "An error occurred during speech recognition.",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };
  
  const handleSavePrescription = () => {
    if (!prescriptionText.trim()) return;
    
    const newAppointment: Appointment = {
      id: `APT-VID-${Date.now()}`,
      patientName: mockPatient.name,
      doctorId: 'dr-ankit',
      doctorName: 'Dr. Ankit',
      doctorSpecialty: mockPatient.department,
      appointmentDate: new Date(),
      type: 'teleconsult',
      status: 'Completed',
      reason: 'Video Consultation',
      diagnosis: 'Teleconsultation',
      doctorsNotes: quickNote || 'Notes taken during video call.',
      prescription: prescriptionText,
    };

    setAppointments(prev => [...prev, newAppointment]);

    toast({
        title: "Prescription Saved!",
        description: `The prescription for ${mockPatient.name} has been saved to their health record.`,
    });
    setPrescriptionText("");
    setIsPrescriptionOpen(false);
  }

  const getStatusText = () => {
      if (isConnecting) return "Connecting...";
      if (isConnected) return "Connected";
      if (hasCameraPermission === false) return "Connection Failed";
      return "Idle";
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-primary/5">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-6">
              <Button asChild variant="outline">
                  <Link href="/doctor-dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Dashboard
                  </Link>
              </Button>
            </div>
            <h1 className="text-center font-headline text-4xl font-bold tracking-tight sm:text-5xl">Video Consultation</h1>
            
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                    <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/doc1/100/100" alt="Dr. Ankit" />
                                    <AvatarFallback>DA</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">Dr. Ankit</CardTitle>
                                    <CardDescription>General Physician</CardDescription>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getStatusText()}
                            </div>
                        </div>
                    </CardHeader>
                  <CardContent className="p-0 relative aspect-video bg-muted flex items-center justify-center">
                    {isConnecting && (
                        <div className="text-center">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Finding an available doctor...</p>
                        </div>
                    )}
                    {isConnected && (
                        <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">
                            <Stethoscope className="h-24 w-24 opacity-20"/>
                            <p className="absolute bottom-4">Doctor's video feed</p>
                        </div>
                    )}
                    {hasCameraPermission === false && !isConnecting && (
                        <Alert variant="destructive" className="m-4">
                            <Video className="h-4 w-4" />
                            <AlertTitle>Camera or Microphone Issue</AlertTitle>
                            <AlertDescription>
                            Could not access camera or microphone. Please ensure they are connected and that you've granted permission in your browser settings.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="absolute bottom-4 right-4 h-1/4 w-1/4 min-w-[120px] rounded-md overflow-hidden border-2 border-background shadow-lg">
                      <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay muted playsInline />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4 flex justify-center gap-4">
                    <Button variant="outline" size="lg" disabled={!isConnected} onClick={handleToggleMute}>
                        {isMuted ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                    <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="lg" disabled={!isConnected}>
                                <FilePlus className="mr-2" /> Write Prescription
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Create Prescription</DialogTitle>
                            <DialogDescription>
                                For patient: {mockPatient.name} (ID: {mockPatient.id}, Dept: {mockPatient.department})
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Start writing or use voice to text..."
                                        className="min-h-[200px] resize-none pr-12"
                                        value={prescriptionText}
                                        onChange={(e) => setPrescriptionText(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant={isListening ? "destructive" : "outline"}
                                        size="icon"
                                        onClick={handleMic}
                                        className="absolute right-2 top-2"
                                        aria-label={isListening ? "Stop dictating" : "Start dictating"}
                                    >
                                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={handleSavePrescription} disabled={!prescriptionText.trim()}>Save Prescription</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="lg" onClick={handleEndCall} disabled={isConnecting || !hasCameraPermission}>
                        <PhoneOff className="mr-2" /> End Call
                    </Button>
                </div>

              </div>
              <div className="md:col-span-1 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Vitals</CardTitle>
                    <CardDescription>Real-time data from ASHA worker.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 overflow-y-auto p-4">
                    <div className="flex items-center gap-4">
                        <HeartPulse className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Heart Rate</div>
                            <div className="font-bold text-2xl">{vitals.heartRate} <span className="text-base font-normal">BPM</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Activity className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Blood Pressure</div>
                            <div className="font-bold text-2xl">{vitals.bloodPressure} <span className="text-base font-normal">mmHg</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Wind className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Oxygen Saturation</div>
                            <div className="font-bold text-2xl">{vitals.oxygenSaturation}<span className="text-base font-normal">%</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Thermometer className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Temperature</div>
                            <div className="font-bold text-2xl">{vitals.temperature.toFixed(1)} <span className="text-base font-normal">°F</span></div>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><NotebookPen/> Quick Notes</CardTitle>
                        <CardDescription>Jot down notes during the consultation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Type your notes here..." 
                            className="min-h-[150px]"
                            value={quickNote}
                            onChange={(e) => setQuickNote(e.target.value)}
                            disabled={!isConnected}
                        />
                        <Button 
                            onClick={handleSaveNote} 
                            disabled={!isConnected || !quickNote.trim()}
                            className="w-full"
                        >
                            Save Note to Record
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
