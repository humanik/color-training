<template>
  <div class="app">
    <div class="container">
      <div class="row">
        <div class="col-6" v-for="(color, num) in colors" :key="num">
          <div :class="blockClass(color)" @click="color.selected = !color.selected">
            <b-icon-check/>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <b-form @submit.prevent="start">
            <b-form-group label="Интервал смены цветов (в секундах)" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="interval"
                type="number"
                min="0.5"
                step="0.5"
                required
              />
            </b-form-group>

            <b-form-group label="Количество циклов" label-for="input-2">
              <b-form-input id="input-2" v-model="cycles" type="number" min="1" step="1" required/>
            </b-form-group>

            <b-form-group>
              <b-form-checkbox v-model="repeat">Повторять цвета</b-form-checkbox>
            </b-form-group>

            <b-form-group>
              <b-button block type="submit" variant="primary">Начать</b-button>
            </b-form-group>
          </b-form>
        </div>
      </div>
    </div>

    <div ref="overlay" class="overlay" v-show="run" @click="cancel"/>
  </div>
</template>

<script>
export default {
  name: 'app',

  data () {
    return {
      cycles: 20,
      repeat: false,
      interval: 3,
      colors: [
        { name: 'blue', selected: true },
        { name: 'red', selected: true },
        { name: 'yellow', selected: true },
        { name: 'green', selected: true },
        { name: 'orange', selected: true }
      ],
      run: false,
      previousColor: null
    }
  },

  computed: {
    selectedColors () {
      return this.colors.filter(item => item.selected)
    }
  },

  methods: {
    async start () {
      if (this.selectedColors.length < 2) {
        alert('Select more colors')
        return
      }

      this.run = true
      for (let count = 0; count < this.cycles; count++) {
        if (!this.run) {
          break
        }

        this.nextColor()

        await new Promise((resolve, reject) => {
          setTimeout(resolve, this.interval * 1000)
        })
      }
      this.cancel()
    },

    cancel () {
      this.run = false
      this.previousColor = null
    },

    nextColor () {
      const color = this.getNextColor()
      const audio = new Audio(`${process.env.BASE_URL}audio/${color.name}.mp3`)

      audio.play()
      this.$refs['overlay'].setAttribute('style', `background: var(--${color.name})`)

      this.previousColor = color
    },

    getNextColor () {
      const colors = [...this.selectedColors]

      if (!this.repeat && this.previousColor) {
        colors.splice(colors.indexOf(this.previousColor), 1)
      }

      return colors[Math.floor(Math.random() * colors.length)]
    },

    blockClass (color) {
      const result = ['color-block', `color-block--${color.name}`]
      if (color.selected) {
        result.push('color-block--selected')
      }

      return result
    }
  }
}
</script>

<style lang="scss">
html, body {
  background-color: #f9f9f9 !important;
}

.app {
  padding-top: 1rem;
  user-select: none;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.color-block {
  margin-bottom: 1rem;
  border-radius: 10px;
  font-size: 50px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: all 200ms;

  .b-icon {
    opacity: 1;
    transition: all 200ms;
  }

  &:not(.color-block--selected) {
    opacity: .5;

    .b-icon {
      opacity: 0;
    }
  }
}

.color-block--blue {
  background-color: var(--blue);
}

.color-block--red {
  background-color: var(--red);
}

.color-block--yellow {
  background-color: var(--yellow);
}

.color-block--green {
  background-color: var(--green);
}

.color-block--orange {
  background-color: var(--orange);
}
</style>
