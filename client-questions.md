# Client Discovery Questions — Chase Group CRM Build-Out

> Prepared based on SharePoint data analysis and system architecture design.
> These questions will fill the gaps between what the data tells us and what we need to build correctly.

---

## 1. PROJECT LIFECYCLE & STATUS

1. **What officially moves a project from Estimating to Active?** Is it a signed contract, a verbal award, a notice to proceed, or something else?
2. **What determines when a project is truly "complete"?** Is there a formal closeout checklist, a final invoice, a warranty start date — or is it just when activity stops?
3. **Do you use "on hold" or "paused" for projects?** If so, how do you currently mark that — rename the folder, move it somewhere, or just stop working on it?
4. **When a lead is dead, do you always add "(Canceled)" to the folder name?** Or are there other conventions we should watch for?
5. **How long should a lead sit idle before we flag it as cold?** 30 days? 60? 90?
6. **When you win a bid, who creates the project folder in the Projects directory?** Is it always the same person, or does it vary?

---

## 2. ESTIMATING & PRECONSTRUCTION

7. **How many estimates are you typically working on at any given time?** Need to understand the pipeline volume.
8. **What's your typical bid turnaround?** From receiving plans to submitting a proposal — days? weeks?
9. **How do you currently track bid deadlines?** Calendar, spreadsheet, memory?
10. **Do you have a standard list of subcontractors you bid to for each trade?** Or is it ad hoc every time?
11. **When you send ITBs (Invitations to Bid), how do you send them?** Email, phone, online portal?
12. **How do you currently compare sub bids?** Spreadsheet? Side by side on paper? What's the pain point?
13. **How often do you catch subs excluding scope items after you've already awarded?** Is this a real problem or occasional?
14. **Do you have standard scope sheet templates for any trades already?** Or is every scope package built from scratch?
15. **What's your markup structure?** OH + profit + fee + contingency — is it standard or does it vary by project type?

---

## 3. BUYOUT & SUBCONTRACT MANAGEMENT

16. **What subcontract template do you use?** AIA? Custom? Does it change by project?
17. **What compliance documents do you require from subs before they start work?** (Insurance COI, W-9, license, OSHA certs, etc.)
18. **How do you currently track sub compliance expirations?** Do insurance certs ever lapse mid-project?
19. **How many subcontracts does a typical project have?** Ballpark — 10? 20? 40?
20. **How long does buyout currently take from award to having all subs under contract?** What would "fast" look like?

---

## 4. PROJECT EXECUTION & FIELD OPS

21. **Who are your PMs and supers?** How many active projects does each person typically manage?
22. **How do you currently track RFIs?** Spreadsheet, email, Procore, or just the folder?
23. **What's your typical RFI response time expectation?** 3 days? 7 days? Does it vary by who it's routed to?
24. **How are change orders handled today?** Is there a formal process, or does it vary by PM?
25. **How do you track job costs?** Excel? Accounting software? What system produces the job cost reports in SharePoint?
26. **How often do you review job costs vs. budget?** Weekly? Monthly? Only when there's a problem?
27. **Who does your progress reports and how often?** Weekly? Monthly? Are they sent to the owner?
28. **How are field photos currently managed?** Who takes them, how do they get uploaded, and who reviews them?
29. **Do you hold weekly OAC (Owner-Architect-Contractor) meetings?** Who takes minutes?
30. **How do you currently track schedule — Microsoft Project (.mpp), Primavera, or something else?**

---

## 5. PEOPLE & ROLES

31. **Who are the key decision-makers that the system needs to notify?** (Names and roles for alert routing)
32. **Who should receive stale project alerts — just the assigned PM, or management too?**
33. **Is there a dedicated estimator, or do PMs estimate their own projects?**
34. **Who handles business development / lead intake?** Is it one person or shared?
35. **Do you want the system to track "Waiting On" status?** (e.g., Waiting on architect, waiting on permit, waiting on owner decision) If so, how would that get entered?

---

## 6. FOLDER STRUCTURE & DOCUMENTS

36. **Is the `00-XXX PROJECT TEMPLATE` folder the current master template?** Should we use that as the standard?
37. **Are there folders in the template that you never actually use?** Any we should remove or add?
38. **The 900-series numbers (like 25-900 MCC Estimating) — are these always internal/template?** Should the CRM exclude them?
39. **Some projects have non-standard folder names like "New folder" or "Temp" — is that just people being in a hurry, or are those intentional holding areas?**
40. **Do you want the system to auto-create folder structures when a project moves to a new phase?** Or would you rather do that manually?

---

## 7. REAL ESTATE DEVELOPMENT

41. **Should the CRM track your development projects (800 E Farrel, Kaliste Saloom, Palmer Parc) separately from pure construction jobs?**
42. **What's different about how you manage a development project vs. a construction-only project?**
43. **Do development projects have their own financial tracking (returns, equity, investor reporting)?**
44. **Are there other development deals in the pipeline that aren't in SharePoint yet?**

---

## 8. EXTERNAL SYSTEMS & INTEGRATIONS

45. **Do you use Procore, Buildertrend, or any other construction management software?** If so, for what?
46. **What accounting system do you use?** (QuickBooks, Sage, Viewpoint, etc.) Can we pull job cost data from it?
47. **Do you use any CRM today?** (Salesforce, HubSpot, spreadsheet, nothing?)
48. **Is email the primary communication channel for bids, RFIs, and submittals?** Or do you use any portals?
49. **Are there any projects tracked outside SharePoint entirely?** (Personal OneDrive, local drives, email-only, etc.)
50. **Do you use Microsoft Teams? Would you want alerts/notifications to go there?**

---

## 9. PRIORITIES & PAIN POINTS

51. **If you could fix ONE thing about how projects are tracked today, what would it be?**
52. **What falls through the cracks most often?** Stale leads? Missing sub docs? Unbilled work? Scope gaps?
53. **How much time per week do you (or your team) spend just looking for information across SharePoint?**
54. **What reporting do you currently provide to ownership / investors?** How is it produced?
55. **What's the #1 thing that costs you money that better systems could prevent?**

---

## 10. QUICK CONFIRMATIONS

56. **What does "FPK" stand for?** (Appears frequently — Fat Pat's Kitchen? First Premier Kitchen?)
57. **Is "MCC" a client name or an internal code?** (25-900 MCC Estimating)
58. **The Operations Team photo site — should we pull those photos into the project view, or keep them separate?**
59. **Are .lnk shortcut files between folders something your team creates intentionally to cross-reference phases?**
60. **Do you want PMs to be able to update project status in the CRM, or should it always be auto-detected from SharePoint content?**

---

*These questions are designed to be asked in a conversational meeting, not handed over as a form. Prioritize sections 1, 2, 5, and 9 for the first conversation.*
