const standings = {
	currentScroll: 0,
	currentStep: 0,

	setScroll() {
		this.scroll.style.transform = `translateX(-${this.currentScroll}px)`;
		this.scroll.className = `standings__scroll standings__scroll_step-${this.currentStep}`;
	},

	setActiveBtn() {
		const oldActiveBtn = this.selector.querySelector('.standings__btn_active');
		const activeBtn = this.selector.querySelector(`.standings__btn[data-standings-btn="${this.currentStep}"]`);

		oldActiveBtn.classList.remove('standings__btn_active');
		activeBtn.classList.add('standings__btn_active');
	},

	scrollContent(type, step) {
		if (step !== undefined) {
			this.currentScroll = step ? this.minWidthColumn + this.maxWidthColumn * (step - 1)
				: 0;
			this.currentStep = step;
		} else {
			if (type === 'next') {
				const widthStep = this.currentStep ? this.maxWidthColumn
					: this.minWidthColumn;

				this.currentScroll += widthStep;
				this.currentStep += 1;
			}
			if (type === 'prev') {
				const widthStep = this.currentStep === 1 ? this.minWidthColumn
					: this.maxWidthColumn;

				this.currentScroll -= widthStep;
				this.currentStep -= 1;
			}
		}

		this.setActiveBtn();
		this.setScroll();
		this.testWidthScroll();
	},

	clickBtn(btn) {
		const step = Number(btn.dataset.standingsBtn);

		if (this.currentStep < btn.dataset.standingsBtn) {
			this.scrollContent('next', step);
		} else {
			this.scrollContent('prev', step);
		}
	},

	clickArrow(arrow) {
		this.scrollContent(arrow.dataset.standingsArrow);
	},

	removeActiveClassTeam(teams) {
		teams.forEach((team) => {
			team.classList.remove('standings-match__team_hover');
		});
	},

	addActiveClassTeam(teams) {
		teams.forEach((team) => {
			team.classList.add('standings-match__team_hover');
			this.outHoverTeam(team, teams);
		});
	},

	outHoverTeam(team, teams) {
		team.addEventListener('mouseout', () => {
			this.removeActiveClassTeam(teams);
		}, { once: true });
	},

	hoverTeam() {
		this.scroll.addEventListener('mouseover', (e) => {
			if (e.target.closest('[data-standings-team]')) {
				const team = e.target.closest('[data-standings-team]');
				const teams = this.scroll.querySelectorAll(`[data-standings-team="${team.dataset.standingsTeam}"]`);

				this.addActiveClassTeam(teams);
			}
		});
	},

	clickStandings() {
		this.selector.addEventListener('click', (e) => {
			e.preventDefault();

			if (e.target.closest('[data-standings-arrow]')) {
				this.clickArrow(e.target.closest('[data-standings-arrow]'));
			} else if (e.target.closest('[data-standings-btn]')) this.clickBtn(e.target.closest('[data-standings-btn]'));
		});
	},

	touchScroll() {
		let currentX = 0;
		let shift = 0;

		const touch = (e) => {
			e.preventDefault();
			shift = currentX - e.changedTouches[0].clientX;

			this.scroll.style.transform = `translateX(-${this.currentScroll + shift}px)`;
		};

		const action = () => {
			if (shift > 40 && (this.currentScroll + this.maxWidthColumn) < this.scroll.offsetWidth) {
				this.scrollContent('next');
			} else if (shift < ((40) * (-1)) && (this.currentScroll - this.minWidthColumn) >= 0) {
				this.scrollContent('prev');
			} else {
				this.scroll.style.transform = `translateX(-${this.currentScroll}px)`;
			}
		};

		this.scroll.addEventListener('touchstart', (e) => {
			currentX = e.changedTouches[0].clientX;
			this.scroll.addEventListener('touchmove', touch);
		});

		this.scroll.addEventListener('touchend', () => {
			this.scroll.removeEventListener('touchmove', touch);
			action();
			currentX = 0;
			shift = 0;
		});
	},

	testWidthScroll() {
		const rest = this.scroll.offsetWidth - this.currentScroll;

		if (this.selector.offsetWidth < rest) {
			this.next.classList.add('standings__arrow_active');
		} else {
			this.next.classList.remove('standings__arrow_active');
		}

		if (this.currentScroll > 0) {
			this.prev.classList.add('standings__arrow_active');
		} else {
			this.prev.classList.remove('standings__arrow_active');
		}
	},

	getWidthColumn() {
		this.minWidthColumn = this.columns[1].offsetLeft;
		this.maxWidthColumn = this.columns[2].offsetLeft - this.minWidthColumn;
	},

	variables() {
		this.scroll = this.selector.querySelector('.standings__scroll');
		this.columns = this.selector.querySelectorAll('.standings__column');

		this.prev = this.selector.querySelector('[data-standings-arrow="prev"]');
		this.next = this.selector.querySelector('[data-standings-arrow="next"]');
	},

	testResizeWidth() {
		window.addEventListener('resize', () => {
			this.scrollContent('prev', 0);
			this.testWidthScroll();
			this.getWidthColumn();
		});
	},

	init() {
		this.selector = document.querySelector('.standings');
		if (!this.selector) return;

		this.variables();
		this.getWidthColumn();
		this.testWidthScroll();
		this.touchScroll();
		this.clickStandings();
		this.hoverTeam();
		this.testResizeWidth();
	},
};

export default standings;
