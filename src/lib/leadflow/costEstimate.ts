export function estimateLeadFlowRunCostUnits(input: {
  totalLeads: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  autoCloseLowScoreLeads: boolean;
}): number {
  const totalLeads = Number.isFinite(input.totalLeads) ? Math.max(0, Math.round(input.totalLeads)) : 0;
  const qualifiedLeads = Number.isFinite(input.qualifiedLeads) ? Math.max(0, Math.round(input.qualifiedLeads)) : 0;
  const meetingsBooked = Number.isFinite(input.meetingsBooked) ? Math.max(0, Math.round(input.meetingsBooked)) : 0;

  let units = totalLeads;

  if (input.autoCloseLowScoreLeads) {
    units += Math.round(totalLeads * 0.1);
  }

  if (qualifiedLeads > 0) {
    units += qualifiedLeads * 2;
  }

  if (meetingsBooked > 0) {
    units += meetingsBooked * 5;
  }

  return Math.max(0, Math.round(units));
}
