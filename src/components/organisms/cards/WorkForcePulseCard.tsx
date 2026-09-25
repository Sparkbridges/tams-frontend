import { ActionIcon, Divider, EmptyState, Paper } from '@mantine/core'
import {
  EyeClosedIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { useMemo, useRef, useState } from 'react'
import { DonutChart } from '@mantine/charts'
import type { TFetchEmployeeHomeDetails } from '#/lib'
import { useDisclosure } from '@mantine/hooks'
import { TamsModal } from '#/components/atoms'

type TWorkForcePulseCardItem = {
  data?: TFetchEmployeeHomeDetails
}

const WorkForcePulseCard = ({ data }: TWorkForcePulseCardItem) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [items, setItems] = useState<string[]>([])
  const titleRef = useRef<string>(null)
  const list = useMemo(() => {
    if (!data) return []
    return [
      {
        id: 1,
        name: 'Present Employees',
        value: data?.present_employees?.length || 400,
        color: 't-blue.3',
        type: 'present',
      },
      {
        id: 2,
        name: 'Absent Employees',
        value: data?.absent_employees?.length || 240,
        color: '#f43f5e',
        type: 'absent',
      },
      {
        id: 3,
        name: 'On Leave Employees',
        value: data?.employees_on_leave?.total || 0,
        color: '#facc15',
        type: 'on_leave',
      },
      {
        id: 4,
        name: 'Employees on exit',
        value: data?.employee_exits?.length || 0,
        color: '#10b981',
        type: 'on_exit',
      },
      {
        id: 5,
        name: 'New Joiners',
        value: data?.new_joiners?.length || 0,
        color: '#3b82f6',
        type: 'new_joiners',
      },
    ]
  }, [data])

  const handleOpenModal = (type: string) => {
    let itemsy: string[] = []
    if (type === 'present') {
      itemsy =
        data?.present_employees.map((emp) => emp.employee_details.name) || []
      titleRef.current = 'Present Employees'
    }
    if (type === 'absent') {
      /* itemsy =
        data?.absent_employees.map((emp) => emp.employee_details.name) || [] */
      titleRef.current = 'Absent Employees'
    }
    /* if (type === 'on_leave') {
      itemsy =
        data?.employees_on_leave.map((emp) => emp.employee_details.name) || []
      titleRef.current = 'On Leave Employees'
    }
    if (type === 'on_exit') {
      itemsy =
        data?.employee_exits.map((emp) => emp.employee_details.name) || []
      titleRef.current = 'Employees on Exit'
    }
    if (type === 'new_joiners') {
      itemsy =
        data?.new_joiners.map((emp) => emp.employee_details.name) || []
      titleRef.current = 'New Joiners'
    } */
    open()
    setItems(itemsy)
  }

  return (
    <Paper
      className="flex justify-between gap-3 rounded-lg"
      withBorder
      px={'lg'}
      py={{ base: 'md', sm: 'xl' }}
    >
      <section className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800  mb-6">
          Workforce Pulse
        </h3>
        <div className="relative flex items-center justify-center mb-4">
          <DonutChart className="z-10" data={list} />
          <div className="text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="block font-title-lg font-bold text-on-surface">
              {data?.present_employees?.length || 400}
            </span>
            <span className="block text-xs text-on-surface-variant uppercase tracking-wide">
              Present
            </span>
          </div>
        </div>
        <p className="font-body-md text-on-surface-variant text-center">
          Out of {data?.employees_count?.total || 0} Total Employees
        </p>
      </section>
      <Divider orientation="vertical" />
      <section className="flex-1">
        <div className="space-y-2">
          {list.map((item, index) => (
            <div
              className="flex border-b border-b-gray-100 text-sm py-1 justify-between items-center"
              key={item.name}
            >
              <span>
                {item.name} ({item.value})
              </span>
              <ActionIcon
                color="red.4"
                variant="subtle"
                size={'sm'}
                onClick={() => handleOpenModal(item.type)}
              >
                {index === item.id && opened ? <EyeIcon /> : <EyeClosedIcon />}
              </ActionIcon>
            </div>
          ))}
        </div>
      </section>
      <TamsModal
        title={titleRef.current}
        opened={opened}
        onClose={close}
        centered
      >
        {items.length == 0 ? (
          <EmptyState
            icon={<MagnifyingGlassIcon />}
            title="No results found"
            description="We couldn't find any employees matching your search."
          ></EmptyState>
        ) : (
          items.map((item, index) => <p key={index}>{item}</p>)
        )}
      </TamsModal>
    </Paper>
  )
}

export default WorkForcePulseCard

/* <script>

export default {
  data() {
    return {
      showModal: false,
      recentActivity: [],
      requireSubscription: false,
      activeId: null,
      bgs: ["#f7bbc3", "#DCDFE5"],
      loading: false,
      employeeId: null,
      employeeClockedInToday: false,
      profile: {},
      employeesCount: {},
      workAnniversaries: [],
      startForAnniversary: 0,
      endForAnniversary: 9,
      anniversaryIncrement: 9,
      birthdays: [],
      startForBirthday: 0,
      endForBirthday: 5,
      birthdayIncrement: 5,
      presentEmployees: [],
      totalPresentEmployees: 0,
      employeesOnLeave: [],
      absentEmployees: [],
      leavesCount: 0,
      loanCount: 0,
      date: "",
      day: "",
      clockIn: "",
      employeeExits: [],
      newJoiners: [],
      employees: [],
      nextHoliday: null,
    };
  },
  computed: {
    currentActivity() {
      return this.activeId
        ? this.recentActivity.find(x => x.id === this.activeId)
        : {};
    },
    employeeHomeProfile() {
      return this.$store.state.ess.employeeHomeProfile;
    },
    currentBirthdays() {
      return this.birthdays.slice(this.startForBirthday, this.endForBirthday);
    },
    currentWorkAnniversaries() {
      return this.workAnniversaries.slice(
        this.startForAnniversary,
        this.endForAnniversary
      );
    },
  },
  created() {
    window.addEventListener("resize", this.trackResize);
    this.requireSubscription = user
      .getUser()
      .employee.company.account_type.includes("premium");
  },
  destroyed() {
    window.removeEventListener("resize", this.trackResize);
  },
  mounted() {
    this.trackResize();
    this.getEmployeeHomeProfile();
    this.getPresentEmployees();
    this.checkPopupStatus();
  },

  methods: {
    getPresentEmployees() {
      const params = {
        page: 1,
        per_page: 1000,
        type: "present",
        branch_id: this.$user.getActiveBranch() || "all",
        date: new Date().toISOString(),
      };

      this.$http
        .get("attendance/dashboard/punctuality", { params })
        .then(response => {
          this.presentEmployees = response.data.results || [];
          this.totalPresentEmployees = response.data.total || 0;
        })
        .catch(() => {
          this.presentEmployees = [];
        });
    },
    checkPopupStatus() {
      this.showModal = this.$store.state.admin.showNeyaModal;
    },
    handleClose() {
      this.$store.commit("admin/showNeyaModal", false);
      this.showModal = false;
    },
    trackResize() {
      if (window.innerWidth < 600) {
        this.startForAnniversary = 0;
        this.endForAnniversary = 5;
        this.anniversaryIncrement = 5;
      }
    },
    nextAnniversary() {
      if (this.startForAnniversary > this.workAnniversaries.length) {
        return;
      }
      this.startForAnniversary += this.anniversaryIncrement;
      this.endForAnniversary += this.anniversaryIncrement;
    },
    previousAnniversary() {
      if (this.startForAnniversary <= 0) {
        return;
      }
      this.startForAnniversary -= this.anniversaryIncrement;
      this.endForAnniversary -= this.anniversaryIncrement;
    },
    nextBirthday() {
      if (this.startForBirthday > this.birthdays.length) {
        return;
      }
      this.startForBirthday += this.birthdayIncrement;
      this.endForBirthday += this.birthdayIncrement;
    },
    previousBirthday() {
      if (this.startForBirthday <= 0) {
        return;
      }
      this.startForBirthday -= this.birthdayIncrement;
      this.endForBirthday -= this.birthdayIncrement;
    },
    gotoEmployeeProfile() {
      if (!this.employeeId) return;
      this.$router.push(
        `/admin/organization/employees/view/${this.employeeId}`
      );
    },
    searchEmployees: debounce(function(searchQuery) {
      this.$store
        .dispatch("searchEmployees", searchQuery)
        .then(response => {
          this.employees = response;
        })
        .catch(error => {
          this.$notification.error(error.message);
        });
    }, 500),
    getEmployeeHomeProfile() {
      this.loading = true;
      this.$store
        .dispatch("admin/fetchEmployeeHomeDetails")
        .then(response => {
          const {
            birthdays,
            readable_date,
            day,
            employee_exits,
            new_joiners,
            work_anniversaries,
            employees_count,
            employees_on_leave,
            recent_activity_histories,
            absent_employees,
            next_public_holiday,
          } = response.data;
          this.birthdays = birthdays;
          this.date = readable_date;
          this.day = day;
          this.employeeExits = employee_exits;
          this.newJoiners = new_joiners;
          this.workAnniversaries = work_anniversaries;
          this.employeesCount = employees_count;
          this.employeesOnLeave = employees_on_leave.results || [];
          this.recentActivity = recent_activity_histories.map(x => ({
            ...x,
            active: false,
          }));
          this.absentEmployees = absent_employees;
          this.activeId =
            recent_activity_histories.length && recent_activity_histories[0].id;
          this.leavesCount = employees_on_leave.length
            ? employees_on_leave.length
            : 0;
          this.nextHoliday = next_public_holiday;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$notification.error(error.message);
        });
    },

    getProfilePicture(picture) {
      return picture !== null && picture !== ""
        ? picture
        : "/img/no-profile-pic.jpg";
    },
    toggleOpen(id) {
      const activity = this.recentActivity.find(x => x.id === id);
      if (!activity) {
        return;
      }
      this.recentActivity.forEach(x => {
        activity.active = !activity.active;
        const panel = this.$refs[`activity-body-${id}`][0];
        if (x.id === id) {
          // const panel = this.$refs[`activity-body-${id}`][0];
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        } else {
          x.active = false;
        }
      });
    },
  },
};
</script> */
