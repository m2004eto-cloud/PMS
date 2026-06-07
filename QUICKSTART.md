# PMS - Quick Start Guide

## Accessing the Application

1. **Open the Dashboard**: Navigate to `http://localhost:8080`
2. **You'll be redirected to Login**: If not authenticated, the app redirects to `/login`
3. **Use Demo Credentials**: Choose from the demo accounts below

## Demo User Accounts

### Admin User (Full Access)
```
Email: admin@pms.com
Password: admin123
```
**Features**: User management, audit logs, all modules

### Production Supervisor
```
Email: supervisor@pms.com
Password: supervisor123
```
**Features**: Batch scheduling, shop floor control, recipes, inventory

### QA Manager
```
Email: qa@pms.com
Password: qa123
```
**Features**: Lab testing, HACCP logging, batch release

### Sales Manager
```
Email: sales@pms.com
Password: sales123
```
**Features**: Order management, contracts, invoicing, FEFO

### Shop Floor Operator
```
Email: operator@pms.com
Password: operator123
```
**Features**: Equipment monitoring, batch processing

## Using the Dashboard

### Main Dashboard Features

After login, you'll see:

1. **Header with User Profile**
   - User avatar with initials
   - Current role displayed
   - Quick access to admin features (if admin)
   - Sign Out button

2. **Left Sidebar Navigation**
   - **Production**: Batch Scheduling, Shop Floor Control, Recipes
   - **Inventory**: Raw Materials, Finished Goods, FEFO Rotation
   - **Quality**: Lab Tests, HACCP Logs
   - **Sales**: Orders, Contracts, Invoicing

3. **Main Content Area**
   - KPI cards showing key metrics
   - Production schedule tracking
   - Equipment status monitoring
   - Quality metrics summary
   - Real-time telemetry logs

4. **Right Sidebar (Telemetry)**
   - Live equipment status
   - Real-time event logs
   - System alerts

## Module Walkthrough

### Production Modules

#### Batch Scheduling & Process Routing
- View today's batch schedule
- See production flow steps (8 sequential stages)
- Monitor batch status (Scheduled, In Progress, Completed)
- Check equipment capacity utilization

#### Shop Floor Control
- Monitor Roasting Drum temperature (Critical Control Point)
- Track Colloid Mill exit temperature
- View all equipment status
- Check live telemetry feed

#### Recipe Management
- Browse tahini and sweet tahini recipes
- View Bill of Materials with loss compensation
- Check viscosity and particle fineness targets
- See production notes for each recipe

### Inventory Modules

#### Raw Materials
- Track sesame lots by supplier
- Monitor Peroxide Value (PV) and Free Fatty Acids (FFA)
- View expiry dates and status
- Check material quality health

#### Finished Goods
- See QC-released inventory
- Monitor products in storage tanks
- Check FEFO rotation order
- View batch traceability

#### FEFO Rotation
- Allocate inventory in expiry order
- Monitor rotation queue
- See priority levels (urgent/high/normal)
- Track allocation history

### Quality Modules

#### QA/QC Lab Tests
- View batch test results (moisture, microbiological, chemistry)
- Check pass/fail status
- Monitor against specifications
- Track test history

#### HACCP Compliance Logs
- View Critical Control Point records
- Check temperature/parameter monitoring
- See corrective actions taken
- Review compliance status

### Sales Modules

#### Order Management
- Track order pipeline (Draft → Invoiced)
- View client orders with fulfillment status
- See order quantities and due dates
- Monitor order allocation

#### B2B Contracts & Pricing
- View active contracts by client
- Check volume-based pricing tiers
- Monitor credit limits
- Calculate order pricing

#### Tax Invoicing
- Create and track tax invoices
- View UAE VAT calculations
- See export vs. domestic invoices
- Monitor payment status

## Admin Panel

### User Management
1. Click user avatar → "User Management"
2. View all users with status (Active/Inactive)
3. Filter by status
4. Click user to see details:
   - Email, ID, department
   - Join date, last login
   - Role and permissions
5. Actions:
   - Activate/Deactivate user
   - Delete user
   - View permission matrix

### Audit Logs
1. Click user avatar → "Audit Logs"
2. View system activity with:
   - Timestamp and user
   - Action and module
   - Success/failure status
   - IP address
3. Filter by:
   - Action type
   - Status (Success/Failed)
4. Review security events

## Key Features

### Real-Time Telemetry
- Equipment temperature monitoring
- Live status updates (simulated)
- Critical alerts when thresholds exceeded
- Event log with timestamps

### Role-Based Access
- Each user role sees only relevant modules
- Restricted routes show access denied message
- Admin can manage user roles
- Audit trail tracks user actions

### HACCP Compliance
- All critical control points logged
- User attribution on every action
- Temperature monitoring with lethality tracking
- Corrective action documentation
- Audit-ready compliance reports

### UAE Regulatory Features
- VAT calculation (5% standard rate)
- Export zero-rating support
- Bilingual invoice capability
- Batch traceability for food safety
- FTA compliance tracking

## Common Tasks

### Create a Batch
1. Go to "Batch Scheduling"
2. Click "Schedule Batch"
3. Fill batch details (product, quantity, raw materials)
4. System allocates to equipment based on capacity
5. Monitor progress in real-time

### Release a Batch for Packaging
1. Go to "Lab Tests"
2. Create test for batch
3. Enter moisture, microbiological, chemistry results
4. Click "Pass" if within specs
5. Batch moves to "Finished Goods"

### Create a Sales Order
1. Go to "Orders"
2. Click "New Order"
3. Select client, product, quantity
4. System checks inventory and credit limit
5. Allocates stock using FEFO rotation
6. Track fulfillment status

### Generate Invoice
1. Go to "Invoicing"
2. Click "Create Invoice"
3. Link to sales order
4. System calculates VAT (5%)
5. Generate PDF/email
6. Tracks payment status

## Troubleshooting

### Can't Login
- Verify email spelling matches demo accounts exactly
- Check password (case-sensitive)
- Try auto-fill by clicking demo account button
- Clear browser cache if persistent

### Access Denied to Module
- Verify your role supports that module (see table in AUTH_SYSTEM.md)
- Try logging in as different role
- Check admin has assigned correct role

### Session Expired
- Click "Sign Out"
- Navigate to app again
- Login with valid credentials

### Equipment Data Not Updating
- Real-time data is simulated (updates every 2-3 seconds)
- Check browser console for errors
- Refresh page if needed

## Support

For detailed information about:
- **Authentication**: See `AUTH_SYSTEM.md`
- **Architecture**: See `AGENTS.md`
- **System Design**: See `QUICKSTART.md` (this file)

## Next Steps

1. **Explore Each Module**: Click through each section to understand data
2. **Try Different Roles**: Login as different users to see role-based access
3. **Review Admin Panel**: Check user management and audit logs
4. **Check Compliance Features**: Review HACCP logs and VAT tracking
5. **Test Critical Features**: Try batch scheduling, QC release, order creation

---

**Happy Manufacturing!** 🏭
