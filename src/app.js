/* ============================================
   نظام إدارة معدات تكنولوجيا المعلومات
   ملف JavaScript الرئيسي
   ============================================ */

/**
 * فئة لإدارة البيانات والتخزين المحلي
 * تتعامل مع حفظ واسترجاع البيانات من localStorage
 */
class DataManager {
    constructor() {
        // مفاتيح التخزين المحلي
        this.DEVICES_KEY = 'it_equipment_devices';
        this.MAINTENANCE_KEY = 'it_equipment_maintenance';
        
        // تحميل البيانات المحفوظة أو إنشاء بيانات افتراضية
        this.devices = this.loadDevices();
        this.maintenance = this.loadMaintenance();
    }

    /**
     * تحميل قائمة المعدات من التخزين المحلي
     * @returns {Array} قائمة المعدات
     */
    loadDevices() {
        const data = localStorage.getItem(this.DEVICES_KEY);
        return data ? JSON.parse(data) : this.getDefaultDevices();
    }

    /**
     * تحميل قائمة طلبات الصيانة من التخزين المحلي
     * @returns {Array} قائمة طلبات الصيانة
     */
    loadMaintenance() {
        const data = localStorage.getItem(this.MAINTENANCE_KEY);
        return data ? JSON.parse(data) : this.getDefaultMaintenance();
    }

    /**
     * الحصول على بيانات افتراضية للمعدات (عينات)
     * @returns {Array} قائمة المعدات الافتراضية
     */
    getDefaultDevices() {
        return [
            {
                id: 1,
                name: 'جهاز كمبيوتر مكتب - المكتب الأول',
                type: 'desktop',
                serial: 'SN-2024-001',
                location: 'المكتب الأول - الطابق الثاني',
                purchaseDate: '2023-01-15',
                status: 'active'
            },
            {
                id: 2,
                name: 'جهاز محمول - قسم التطوير',
                type: 'laptop',
                serial: 'SN-2024-002',
                location: 'قسم التطوير - الطابق الأول',
                purchaseDate: '2023-06-20',
                status: 'active'
            },
            {
                id: 3,
                name: 'طابعة - غرفة الطباعة',
                type: 'printer',
                serial: 'SN-2024-003',
                location: 'غرفة الطباعة - الطابق الأرضي',
                purchaseDate: '2022-11-10',
                status: 'maintenance'
            }
        ];
    }

    /**
     * الحصول على بيانات افتراضية لطلبات الصيانة (عينات)
     * @returns {Array} قائمة طلبات الصيانة الافتراضية
     */
    getDefaultMaintenance() {
        return [
            {
                id: 1,
                deviceId: 3,
                deviceName: 'طابعة - غرفة الطباعة',
                type: 'preventive',
                description: 'صيانة دورية وتنظيف الطابعة',
                priority: 'medium',
                date: '2024-03-10',
                status: 'pending'
            }
        ];
    }

    /**
     * حفظ المعدات في التخزين المحلي
     */
    saveDevices() {
        localStorage.setItem(this.DEVICES_KEY, JSON.stringify(this.devices));
    }

    /**
     * حفظ طلبات الصيانة في التخزين المحلي
     */
    saveMaintenance() {
        localStorage.setItem(this.MAINTENANCE_KEY, JSON.stringify(this.maintenance));
    }

    /**
     * إضافة معدة جديدة
     * @param {Object} device - بيانات المعدة الجديدة
     * @returns {Object} المعدة المضافة مع معرّف فريد
     */
    addDevice(device) {
        const newDevice = {
            id: Date.now(),
            ...device
        };
        this.devices.push(newDevice);
        this.saveDevices();
        return newDevice;
    }

    /**
     * تحديث معدة موجودة
     * @param {number} id - معرّف المعدة
     * @param {Object} updates - البيانات المراد تحديثها
     */
    updateDevice(id, updates) {
        const device = this.devices.find(d => d.id === id);
        if (device) {
            Object.assign(device, updates);
            this.saveDevices();
        }
    }

    /**
     * حذف معدة
     * @param {number} id - معرّف المعدة
     */
    deleteDevice(id) {
        this.devices = this.devices.filter(d => d.id !== id);
        this.saveDevices();
    }

    /**
     * إضافة طلب صيانة جديد
     * @param {Object} maintenance - بيانات طلب الصيانة
     * @returns {Object} طلب الصيانة المضاف
     */
    addMaintenance(maintenance) {
        const newMaintenance = {
            id: Date.now(),
            status: 'pending',
            ...maintenance
        };
        this.maintenance.push(newMaintenance);
        this.saveMaintenance();
        return newMaintenance;
    }

    /**
     * تحديث طلب صيانة
     * @param {number} id - معرّف الطلب
     * @param {Object} updates - البيانات المراد تحديثها
     */
    updateMaintenance(id, updates) {
        const maintenance = this.maintenance.find(m => m.id === id);
        if (maintenance) {
            Object.assign(maintenance, updates);
            this.saveMaintenance();
        }
    }

    /**
     * حذف طلب صيانة
     * @param {number} id - معرّف الطلب
     */
    deleteMaintenance(id) {
        this.maintenance = this.maintenance.filter(m => m.id !== id);
        this.saveMaintenance();
    }

    /**
     * الحصول على إحصائيات عن المعدات
     * @returns {Object} إحصائيات المعدات
     */
    getDeviceStats() {
        return {
            total: this.devices.length,
            active: this.devices.filter(d => d.status === 'active').length,
            inactive: this.devices.filter(d => d.status === 'inactive').length,
            maintenance: this.devices.filter(d => d.status === 'maintenance').length,
            maintenanceRequests: this.maintenance.length
        };
    }

    /**
     * الحصول على توزيع أنواع المعدات
     * @returns {Object} توزيع الأنواع
     */
    getDeviceTypeDistribution() {
        const distribution = {};
        this.devices.forEach(device => {
            distribution[device.type] = (distribution[device.type] || 0) + 1;
        });
        return distribution;
    }

    /**
     * الحصول على توزيع حالات المعدات
     * @returns {Object} توزيع الحالات
     */
    getDeviceStatusDistribution() {
        return {
            active: this.devices.filter(d => d.status === 'active').length,
            inactive: this.devices.filter(d => d.status === 'inactive').length,
            maintenance: this.devices.filter(d => d.status === 'maintenance').length
        };
    }
}

/**
 * فئة لإدارة واجهة المستخدم
 * تتعامل مع عرض البيانات والتفاعل مع المستخدم
 */
class UIManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.initializeEventListeners();
        this.updateDashboard();
    }

    /**
     * تهيئة جميع مستمعي الأحداث
     */
    initializeEventListeners() {
        // ملاحة القائمة الجانبية
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // أزرار المعدات
        document.getElementById('add-device-btn').addEventListener('click', () => this.showDeviceForm());
        document.getElementById('close-device-form').addEventListener('click', () => this.hideDeviceForm());
        document.getElementById('cancel-device-form').addEventListener('click', () => this.hideDeviceForm());
        document.getElementById('device-form').addEventListener('submit', (e) => this.handleDeviceSubmit(e));

        // أزرار الصيانة
        document.getElementById('add-maintenance-btn').addEventListener('click', () => this.showMaintenanceForm());
        document.getElementById('close-maintenance-form').addEventListener('click', () => this.hideMaintenanceForm());
        document.getElementById('cancel-maintenance-form').addEventListener('click', () => this.hideMaintenanceForm());
        document.getElementById('maintenance-form').addEventListener('submit', (e) => this.handleMaintenanceSubmit(e));

        // أزرار التقارير
        document.getElementById('export-devices-btn').addEventListener('click', () => this.generateDevicesReport());
        document.getElementById('export-maintenance-btn').addEventListener('click', () => this.generateMaintenanceReport());
        document.getElementById('export-performance-btn').addEventListener('click', () => this.generatePerformanceReport());
        document.getElementById('print-report-btn').addEventListener('click', () => window.print());
        document.getElementById('close-report-btn').addEventListener('click', () => this.hideReport());

        // إغلاق النماذج عند النقر خارجها
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    /**
     * معالجة الملاحة بين الأقسام
     * @param {Event} e - حدث النقر
     */
    handleNavigation(e) {
        e.preventDefault();
        
        // إزالة الفئة النشطة من جميع الروابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // إضافة الفئة النشطة للرابط المنقور
        e.target.classList.add('active');
        
        // إخفاء جميع الأقسام
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // عرض القسم المطلوب
        const sectionId = e.target.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            
            // تحديث البيانات حسب القسم
            if (sectionId === 'devices') {
                this.renderDevicesTable();
            } else if (sectionId === 'maintenance') {
                this.renderMaintenanceTable();
            } else if (sectionId === 'status') {
                this.renderStatusSection();
            }
        }
    }

    /**
     * تحديث لوحة التحكم بالإحصائيات
     */
    updateDashboard() {
        const stats = this.dataManager.getDeviceStats();
        document.getElementById('total-devices').textContent = stats.total;
        document.getElementById('active-devices').textContent = stats.active;
        document.getElementById('inactive-devices').textContent = stats.inactive;
        document.getElementById('maintenance-count').textContent = stats.maintenanceRequests;
    }

    /**
     * عرض نموذج إضافة معدة جديدة
     */
    showDeviceForm() {
        document.getElementById('add-device-form').classList.remove('hidden');
        document.getElementById('device-form').reset();
    }

    /**
     * إخفاء نموذج المعدة
     */
    hideDeviceForm() {
        document.getElementById('add-device-form').classList.add('hidden');
    }

    /**
     * معالجة إرسال نموذج المعدة
     * @param {Event} e - حدث الإرسال
     */
    handleDeviceSubmit(e) {
        e.preventDefault();
        
        const device = {
            name: document.getElementById('device-name').value,
            type: document.getElementById('device-type').value,
            serial: document.getElementById('device-serial').value,
            location: document.getElementById('device-location').value,
            purchaseDate: document.getElementById('device-purchase-date').value,
            status: document.getElementById('device-status').value
        };
        
        this.dataManager.addDevice(device);
        this.hideDeviceForm();
        this.renderDevicesTable();
        this.updateDashboard();
        this.updateMaintenanceDeviceOptions();
        this.showNotification('تم إضافة المعدة بنجاح!', 'success');
    }

    /**
     * عرض جدول المعدات
     */
    renderDevicesTable() {
        const tbody = document.getElementById('devices-tbody');
        const noMsg = document.getElementById('no-devices-msg');
        
        tbody.innerHTML = '';
        
        if (this.dataManager.devices.length === 0) {
            noMsg.style.display = 'block';
            return;
        }
        
        noMsg.style.display = 'none';
        
        this.dataManager.devices.forEach(device => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${device.name}</td>
                <td>${this.getDeviceTypeLabel(device.type)}</td>
                <td>${device.serial}</td>
                <td>${device.location}</td>
                <td>${device.purchaseDate}</td>
                <td><span class="status-badge ${device.status}">${this.getStatusLabel(device.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="uiManager.editDevice(${device.id})">تعديل</button>
                        <button class="btn btn-danger" onclick="uiManager.deleteDevice(${device.id})">حذف</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * حذف معدة
     * @param {number} id - معرّف المعدة
     */
    deleteDevice(id) {
        if (confirm('هل أنت متأكد من حذف هذه المعدة؟')) {
            this.dataManager.deleteDevice(id);
            this.renderDevicesTable();
            this.updateDashboard();
            this.showNotification('تم حذف المعدة بنجاح!', 'success');
        }
    }

    /**
     * تعديل معدة (يمكن توسيعها لاحقاً)
     * @param {number} id - معرّف المعدة
     */
    editDevice(id) {
        this.showNotification('ميزة التعديل قيد التطوير', 'info');
    }

    /**
     * عرض نموذج إضافة طلب صيانة جديد
     */
    showMaintenanceForm() {
        document.getElementById('add-maintenance-form').classList.remove('hidden');
        document.getElementById('maintenance-form').reset();
        this.updateMaintenanceDeviceOptions();
    }

    /**
     * إخفاء نموذج الصيانة
     */
    hideMaintenanceForm() {
        document.getElementById('add-maintenance-form').classList.add('hidden');
    }

    /**
     * تحديث قائمة المعدات في نموذج الصيانة
     */
    updateMaintenanceDeviceOptions() {
        const select = document.getElementById('maintenance-device');
        select.innerHTML = '<option value="">اختر المعدة</option>';
        
        this.dataManager.devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.id;
            option.textContent = device.name;
            select.appendChild(option);
        });
    }

    /**
     * معالجة إرسال نموذج الصيانة
     * @param {Event} e - حدث الإرسال
     */
    handleMaintenanceSubmit(e) {
        e.preventDefault();
        
        const deviceId = parseInt(document.getElementById('maintenance-device').value);
        const device = this.dataManager.devices.find(d => d.id === deviceId);
        
        if (!device) {
            this.showNotification('يرجى اختيار معدة صحيحة', 'error');
            return;
        }
        
        const maintenance = {
            deviceId: deviceId,
            deviceName: device.name,
            type: document.getElementById('maintenance-type').value,
            description: document.getElementById('maintenance-description').value,
            priority: document.getElementById('maintenance-priority').value,
            date: document.getElementById('maintenance-date').value
        };
        
        this.dataManager.addMaintenance(maintenance);
        this.hideMaintenanceForm();
        this.renderMaintenanceTable();
        this.updateDashboard();
        this.showNotification('تم إضافة طلب الصيانة بنجاح!', 'success');
    }

    /**
     * عرض جدول طلبات الصيانة
     */
    renderMaintenanceTable() {
        const tbody = document.getElementById('maintenance-tbody');
        const noMsg = document.getElementById('no-maintenance-msg');
        
        tbody.innerHTML = '';
        
        if (this.dataManager.maintenance.length === 0) {
            noMsg.style.display = 'block';
            return;
        }
        
        noMsg.style.display = 'none';
        
        this.dataManager.maintenance.forEach(maintenance => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${maintenance.deviceName}</td>
                <td>${this.getMaintenanceTypeLabel(maintenance.type)}</td>
                <td>${maintenance.description}</td>
                <td><span class="priority-badge ${maintenance.priority}">${this.getPriorityLabel(maintenance.priority)}</span></td>
                <td>${maintenance.date}</td>
                <td><span class="status-badge ${maintenance.status}">${this.getMaintenanceStatusLabel(maintenance.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-success" onclick="uiManager.completeMaintenance(${maintenance.id})">إكمال</button>
                        <button class="btn btn-danger" onclick="uiManager.deleteMaintenance(${maintenance.id})">حذف</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * إكمال طلب صيانة
     * @param {number} id - معرّف الطلب
     */
    completeMaintenance(id) {
        this.dataManager.updateMaintenance(id, { status: 'completed' });
        this.renderMaintenanceTable();
        this.updateDashboard();
        this.showNotification('تم تحديث حالة الصيانة بنجاح!', 'success');
    }

    /**
     * حذف طلب صيانة
     * @param {number} id - معرّف الطلب
     */
    deleteMaintenance(id) {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            this.dataManager.deleteMaintenance(id);
            this.renderMaintenanceTable();
            this.updateDashboard();
            this.showNotification('تم حذف الطلب بنجاح!', 'success');
        }
    }

    /**
     * عرض قسم حالة النظام
     */
    renderStatusSection() {
        this.renderStatusDetails();
        this.renderCharts();
    }

    /**
     * عرض تفاصيل حالة المعدات
     */
    renderStatusDetails() {
        const container = document.getElementById('status-details');
        container.innerHTML = '';
        
        this.dataManager.devices.forEach(device => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            statusItem.innerHTML = `
                <div class="status-item-info">
                    <h4>${device.name}</h4>
                    <p>النوع: ${this.getDeviceTypeLabel(device.type)} | الموقع: ${device.location}</p>
                </div>
                <span class="status-badge ${device.status}">${this.getStatusLabel(device.status)}</span>
            `;
            container.appendChild(statusItem);
        });
    }

    /**
     * رسم الرسوم البيانية (باستخدام Canvas)
     */
    renderCharts() {
        this.drawDeviceTypeChart();
        this.drawDeviceStatusChart();
    }

    /**
     * رسم الرسم البياني لتوزيع أنواع المعدات
     */
    drawDeviceTypeChart() {
        const canvas = document.getElementById('device-types-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const distribution = this.dataManager.getDeviceTypeDistribution();
        const types = Object.keys(distribution);
        const counts = Object.values(distribution);
        
        // تنظيف الـ Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // رسم رسم بياني بسيط (أعمدة)
        const barWidth = canvas.width / types.length;
        const maxCount = Math.max(...counts);
        const scale = (canvas.height - 40) / maxCount;
        
        types.forEach((type, index) => {
            const x = index * barWidth;
            const height = counts[index] * scale;
            const y = canvas.height - height - 20;
            
            // رسم العمود
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(x + 10, y, barWidth - 20, height);
            
            // كتابة التسمية
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.getDeviceTypeLabel(type), x + barWidth / 2, canvas.height - 5);
            
            // كتابة القيمة
            ctx.fillText(counts[index], x + barWidth / 2, y - 5);
        });
    }

    /**
     * رسم الرسم البياني لتوزيع حالات المعدات
     */
    drawDeviceStatusChart() {
        const canvas = document.getElementById('device-status-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const distribution = this.dataManager.getDeviceStatusDistribution();
        
        // تنظيف الـ Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // رسم رسم بياني دائري (Pie Chart)
        const total = distribution.active + distribution.inactive + distribution.maintenance;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const colors = {
            active: '#10b981',
            inactive: '#ef4444',
            maintenance: '#f59e0b'
        };
        
        let currentAngle = -Math.PI / 2;
        
        Object.entries(distribution).forEach(([status, count]) => {
            const sliceAngle = (count / total) * 2 * Math.PI;
            
            // رسم القطاع
            ctx.fillStyle = colors[status];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // رسم التسمية
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(count, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // رسم الوسيلة الإيضاحية
        const legendY = canvas.height - 40;
        let legendX = 10;
        
        Object.entries(distribution).forEach(([status, count]) => {
            ctx.fillStyle = colors[status];
            ctx.fillRect(legendX, legendY, 15, 15);
            
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(this.getStatusLabel(status) + ' (' + count + ')', legendX + 20, legendY + 12);
            
            legendX += 150;
        });
    }

    /**
     * إنشاء تقرير المعدات
     */
    generateDevicesReport() {
        const reportContent = document.getElementById('report-content');
        let html = '<table><thead><tr><th>اسم المعدة</th><th>النوع</th><th>الرقم التسلسلي</th><th>الموقع</th><th>تاريخ الشراء</th><th>الحالة</th></tr></thead><tbody>';
        
        this.dataManager.devices.forEach(device => {
            html += `
                <tr>
                    <td>${device.name}</td>
                    <td>${this.getDeviceTypeLabel(device.type)}</td>
                    <td>${device.serial}</td>
                    <td>${device.location}</td>
                    <td>${device.purchaseDate}</td>
                    <td>${this.getStatusLabel(device.status)}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        this.showReport('تقرير المعدات', html);
    }

    /**
     * إنشاء تقرير الصيانة
     */
    generateMaintenanceReport() {
        const reportContent = document.getElementById('report-content');
        let html = '<table><thead><tr><th>المعدة</th><th>النوع</th><th>الوصف</th><th>الأولوية</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>';
        
        this.dataManager.maintenance.forEach(maintenance => {
            html += `
                <tr>
                    <td>${maintenance.deviceName}</td>
                    <td>${this.getMaintenanceTypeLabel(maintenance.type)}</td>
                    <td>${maintenance.description}</td>
                    <td>${this.getPriorityLabel(maintenance.priority)}</td>
                    <td>${maintenance.date}</td>
                    <td>${this.getMaintenanceStatusLabel(maintenance.status)}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        this.showReport('تقرير الصيانة', html);
    }

    /**
     * إنشاء تقرير الأداء
     */
    generatePerformanceReport() {
        const stats = this.dataManager.getDeviceStats();
        const distribution = this.dataManager.getDeviceTypeDistribution();
        
        let html = '<h3>ملخص الأداء</h3>';
        html += '<table><tr><td>إجمالي المعدات:</td><td>' + stats.total + '</td></tr>';
        html += '<tr><td>المعدات النشطة:</td><td>' + stats.active + '</td></tr>';
        html += '<tr><td>المعدات المعطلة:</td><td>' + stats.inactive + '</td></tr>';
        html += '<tr><td>المعدات تحت الصيانة:</td><td>' + stats.maintenance + '</td></tr>';
        html += '<tr><td>طلبات الصيانة:</td><td>' + stats.maintenanceRequests + '</td></tr>';
        html += '</table>';
        
        html += '<h3>توزيع الأنواع</h3>';
        html += '<table><thead><tr><th>النوع</th><th>العدد</th></tr></thead><tbody>';
        
        Object.entries(distribution).forEach(([type, count]) => {
            html += `<tr><td>${this.getDeviceTypeLabel(type)}</td><td>${count}</td></tr>`;
        });
        
        html += '</tbody></table>';
        
        this.showReport('تقرير الأداء', html);
    }

    /**
     * عرض التقرير
     * @param {string} title - عنوان التقرير
     * @param {string} content - محتوى التقرير
     */
    showReport(title, content) {
        document.getElementById('report-title').textContent = title;
        document.getElementById('report-content').innerHTML = content;
        document.getElementById('reports-output').classList.remove('hidden');
    }

    /**
     * إخفاء التقرير
     */
    hideReport() {
        document.getElementById('reports-output').classList.add('hidden');
    }

    /**
     * عرض إشعار
     * @param {string} message - رسالة الإشعار
     * @param {string} type - نوع الإشعار (success, error, info)
     */
    showNotification(message, type = 'info') {
        // يمكن تحسين هذا لاحقاً بإضافة نظام إشعارات أفضل
        alert(message);
    }

    /**
     * الحصول على تسمية نوع المعدة
     * @param {string} type - نوع المعدة
     * @returns {string} التسمية بالعربية
     */
    getDeviceTypeLabel(type) {
        const labels = {
            laptop: 'جهاز محمول',
            desktop: 'جهاز مكتب',
            printer: 'طابعة',
            router: 'موجه شبكة',
            server: 'خادم',
            monitor: 'شاشة',
            other: 'أخرى'
        };
        return labels[type] || type;
    }

    /**
     * الحصول على تسمية الحالة
     * @param {string} status - الحالة
     * @returns {string} التسمية بالعربية
     */
    getStatusLabel(status) {
        const labels = {
            active: 'نشطة',
            inactive: 'معطلة',
            maintenance: 'تحت الصيانة'
        };
        return labels[status] || status;
    }

    /**
     * الحصول على تسمية نوع الصيانة
     * @param {string} type - النوع
     * @returns {string} التسمية بالعربية
     */
    getMaintenanceTypeLabel(type) {
        const labels = {
            preventive: 'وقائية',
            corrective: 'إصلاحية',
            emergency: 'طارئة'
        };
        return labels[type] || type;
    }

    /**
     * الحصول على تسمية الأولوية
     * @param {string} priority - الأولوية
     * @returns {string} التسمية بالعربية
     */
    getPriorityLabel(priority) {
        const labels = {
            low: 'منخفضة',
            medium: 'متوسطة',
            high: 'عالية'
        };
        return labels[priority] || priority;
    }

    /**
     * الحصول على تسمية حالة الصيانة
     * @param {string} status - الحالة
     * @returns {string} التسمية بالعربية
     */
    getMaintenanceStatusLabel(status) {
        const labels = {
            pending: 'قيد الانتظار',
            completed: 'مكتملة'
        };
        return labels[status] || status;
    }
}

/**
 * تهيئة التطبيق عند تحميل الصفحة
 */
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء مدير البيانات
    const dataManager = new DataManager();
    
    // إنشاء مدير الواجهة
    window.uiManager = new UIManager(dataManager);
    
    // تحديث الجداول الأولية
    window.uiManager.renderDevicesTable();
    window.uiManager.renderMaintenanceTable();
});
