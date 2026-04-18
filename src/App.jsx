import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import UserDetailsForm from "./components/forms/UserDetailsForm";
import WorkoutPlan from "./components/plans/WorkoutPlan";
import DietPlan from "./components/plans/DietPlan";
import AITips from "./components/plans/AITips";
import MotivationQuote from "./components/features/MotivationQuote";
import VoiceReader from "./components/features/VoiceReader";
import ExportPDF from "./components/features/ExportPDF";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Sparkles, User, Target, Activity, AlertCircle } from "lucide-react";
import { generateFitnessPlan } from "./services/geminiService";
import toast from "react-hot-toast";

function App() {
  const [currentStep, setCurrentStep] = useState("form");
  const [userDetails, setUserDetails] = useLocalStorage("userDetails", null);
  const [fitnessPlans, setFitnessPlans] = useLocalStorage("fitnessPlans", null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails && fitnessPlans) {
      setCurrentStep("plans");
    }
  }, []);

  const handlePlanGenerated = (plans) => {
    setFitnessPlans(plans);
    setCurrentStep("plans");
    setLoading(false);
  };

  const handleRegenerate = async () => {
    if (!userDetails) {
      toast.error("No user details found!");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Regenerating your fitness plan...", { id: "regenerate" });
      const newPlans = await generateFitnessPlan(userDetails);
      setFitnessPlans(newPlans);
      toast.success("New plan generated successfully!", { id: "regenerate" });
    } catch (error) {
      toast.error("Failed to regenerate plan. Please try again.", {
        id: "regenerate",
      });
      console.error("Regenerate error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    setCurrentStep("form");
    setUserDetails(null);
    setFitnessPlans(null);
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { text: "Normal", color: "text-green-600" };
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" };
    return { text: "Obese", color: "text-red-600" };
  };

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <AnimatePresence mode="wait">
          {currentStep === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MotivationQuote />
              <UserDetailsForm
                onPlanGenerated={handlePlanGenerated}
                setUserDetails={setUserDetails}
                setLoading={setLoading}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              
              <div className="glass-effect rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                 
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                          {userDetails?.name}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {userDetails?.age} years • {userDetails?.gender}
                        </p>
                      </div>
                    </div>

                  
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Height
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {userDetails?.height} cm
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Weight
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {userDetails?.weight} kg
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          BMI
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            getBMICategory(
                              calculateBMI(
                                userDetails?.weight,
                                userDetails?.height
                              )
                            ).color
                          }`}
                        >
                          {calculateBMI(
                            userDetails?.weight,
                            userDetails?.height
                          )}
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Status
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            getBMICategory(
                              calculateBMI(
                                userDetails?.weight,
                                userDetails?.height
                              )
                            ).color
                          }`}
                        >
                          {
                            getBMICategory(
                              calculateBMI(
                                userDetails?.weight,
                                userDetails?.height
                              )
                            ).text
                          }
                        </p>
                      </div>
                    </div>

                    
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                        <Target size={14} />
                        {userDetails?.goal}
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                        📍 {userDetails?.location}
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                        💪 {userDetails?.fitnessLevel}
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                        🍽️ {userDetails?.diet}
                      </span>
                      {userDetails?.stressLevel && (
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                          😌 {userDetails?.stressLevel} Stress
                        </span>
                      )}
                    </div>
                  </div>

                  
                  {(userDetails?.medicalHistory ||
                    userDetails?.medications) && (
                    <div className="lg:w-96 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1"
                          size={22}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                            <span>⚕️ Health Information</span>
                          </h3>

                          {userDetails.medicalHistory && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                                Medical Conditions:
                              </p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                                {userDetails.medicalHistory}
                              </p>
                            </div>
                          )}

                          {userDetails.medications && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                                Current Medications:
                              </p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                                {userDetails.medications}
                              </p>
                            </div>
                          )}

                          <div className="pt-2 border-t border-yellow-300 dark:border-yellow-700">
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              ⚠️ This plan is customized for your health
                              conditions. Always consult your doctor before
                              starting a new fitness program.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

               
                <div className="flex gap-3 flex-wrap mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <VoiceReader
                    workoutPlan={fitnessPlans?.workout}
                    dietPlan={fitnessPlans?.diet}
                  />
                  <ExportPDF
                    userDetails={userDetails}
                    fitnessPlans={fitnessPlans}
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Sparkles
                      size={20}
                      className={loading ? "animate-spin" : ""}
                    />
                    {loading ? "Regenerating..." : "Regenerate Plan"}
                  </button>
                  <button
                    onClick={handleStartNew}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Activity size={20} />
                    New Plan
                  </button>
                </div>
              </div>

             
              {loading && (
                <div className="glass-effect rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="loading-spinner"></div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Generating your new personalized plan...
                    </p>
                  </div>
                </div>
              )}

             
              {!loading && fitnessPlans && (
                <>
                  <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start">
                    <div className="flex-1 lg:min-h-0">
                      {" "}
                    
                      <WorkoutPlan workout={fitnessPlans?.workout} />
                    </div>
                    <div className="flex-1 lg:min-h-0">
                      {" "}
                      
                      <DietPlan diet={fitnessPlans?.diet} />
                    </div>
                  </div>

                  <AITips tips={fitnessPlans?.tips} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default App;
