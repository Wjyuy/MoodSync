"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, Brain, BarChart3, Users, TrendingUp } from 'lucide-react'
import { ContactManagement } from "@/components/admin/contact-management"
import { FeedbackManagement } from "@/components/admin/feedback-management"
import { ModelTraining } from "@/components/admin/model-training"
import { AdminStats } from "@/components/admin/admin-status"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-300">MoodSync 시스템 관리 및 모니터링</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              개요
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              문의 관리
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              피드백 관리
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              모델 학습
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackManagement />
          </TabsContent>

          <TabsContent value="training">
            <ModelTraining />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
