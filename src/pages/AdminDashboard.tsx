import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, BarChart3, Mail, Calendar, ExternalLink, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface LeadRow {
  id: string;
  first_name: string | null;
  email: string | null;
  created_at: string;
}

interface AnalysisRow {
  id: string;
  lead_id: string | null;
  source_url: string;
  brand_research: any;
  effectiveness: any;
  ai_visibility: any;
  created_at: string;
  leads?: LeadRow | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminVerified, setAdminVerified] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Require Ctrl+Shift+B to access
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "B") {
        setAdminVerified(true);
        toast.success("Admin access granted");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analysesRes, leadsRes] = await Promise.all([
        supabase.from("brand_analyses").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
      ]);

      if (analysesRes.data) setAnalyses(analysesRes.data as AnalysisRow[]);
      if (leadsRes.data) setLeads(leadsRes.data as LeadRow[]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminVerified) fetchData();
  }, [adminVerified]);

  const getLeadForAnalysis = (leadId: string | null) => {
    if (!leadId) return null;
    return leads.find((l) => l.id === leadId) || null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const leadsWithEmail = leads.filter((l) => l.email);
  const totalAnalyses = analyses.length;
  const analysesWithLeads = analyses.filter((a) => a.lead_id).length;

  if (!adminVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-sm w-full mx-4">
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Admin Access Required</h2>
            <p className="text-sm text-muted-foreground">
              Use the admin shortcut to unlock this dashboard.
            </p>
            <Button variant="outline" onClick={() => navigate("/lab")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/lab")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leads Dashboard</h1>
              <p className="text-sm text-muted-foreground">All captured leads and analysis results</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Total Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalAnalyses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leads Captured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analysesWithLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalAnalyses > 0 ? Math.round((analysesWithLeads / totalAnalyses) * 100) : 0}% capture rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Emails Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{leadsWithEmail.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Analyses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
            ) : analyses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No analyses yet. Results will appear here once users run the tool.</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]" />
                      <TableHead>Date</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => {
                      const lead = getLeadForAnalysis(analysis.lead_id);
                      const score = analysis.effectiveness?.overall_score;
                      const grade = analysis.effectiveness?.overall_grade;
                      const isExpanded = expandedRow === analysis.id;

                      return (
                        <>
                          <TableRow
                            key={analysis.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setExpandedRow(isExpanded ? null : analysis.id)}
                          >
                            <TableCell>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatDate(analysis.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <a
                                href={analysis.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {new URL(analysis.source_url).hostname}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell className="text-sm">
                              {lead?.first_name || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="text-sm">
                              {lead?.email ? (
                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                                  {lead.email}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {score !== undefined && grade ? (
                                <Badge variant="outline" className="text-xs font-semibold">
                                  {grade} ({score})
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {analysis.brand_research && <Badge variant="secondary" className="text-xs">Brand</Badge>}
                                {analysis.effectiveness && <Badge variant="secondary" className="text-xs">Score</Badge>}
                                {analysis.ai_visibility && <Badge variant="secondary" className="text-xs">AI</Badge>}
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow key={`${analysis.id}-detail`}>
                              <TableCell colSpan={7} className="bg-muted/30 p-4">
                                <div className="space-y-3">
                                  {analysis.brand_research && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Brand Research</h4>
                                      <div className="text-xs text-muted-foreground space-y-1">
                                        <p><span className="font-medium">Tagline:</span> {analysis.brand_research.business_tagline}</p>
                                        <p><span className="font-medium">CTA:</span> {analysis.brand_research.primary_call_to_action}</p>
                                        <p><span className="font-medium">Ideal Client:</span> {analysis.brand_research.ideal_client_niche}</p>
                                        <p><span className="font-medium">Solution:</span> {analysis.brand_research.core_service_solution}</p>
                                      </div>
                                    </div>
                                  )}
                                  {analysis.effectiveness && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Effectiveness Scores</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {analysis.effectiveness.categories?.map((cat: any, i: number) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {cat.category}: {cat.score} ({cat.label})
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {analysis.ai_visibility && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">AI Visibility</h4>
                                      <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Eligibility:</span> {analysis.ai_visibility.eligibility}
                                      </p>
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = `analysis-${analysis.source_url.replace(/https?:\/\//, "").replace(/\//g, "-")}.json`;
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    }}
                                  >
                                    Download Full JSON
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
